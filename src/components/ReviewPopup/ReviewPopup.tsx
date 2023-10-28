import './ReviewPopup.css'
import CustomPopup from "../CustomPopup/CustomPopup";
import React, {useEffect, useState} from "react";
import config from "../../config";
// @ts-ignore
import Cookies from "js-cookie";

function ReviewPopup(props:any) {

    //from props
    const setIsReviewPopupVisible = props.setIsReviewPopupVisible;
    const isReviewPopupVisible = props.isReviewPopupVisible;
    const productID = props.productID;
    const buttonText = props.buttonText;
    const update = props.update;
    const review = props.review; //used only if the review has to be updated

    //states used for managing the product score. One for when the user hovers over a score, and one for when the user clicks on that score
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [rating, setRating] = useState<number>(props.initialRating);
    const [reviewTitle, setReviewTitle] = useState<string>(props.initialTitle);
    const [reviewBody, setReviewBody] = useState<string>(props.initialBody);

    const [isPendingAddReview, setIsPendingAddReview] = useState<boolean>(false);
    const [postReviewError, setPostReviewError] = useState<string>("");

    const [reviewTitleErrorMessage, setReviewTitleErrorMessage] = useState<string>("");
    const [reviewBodyErrorMessage, setReviewBodyErrorMessage] = useState<string>("");
    const [isPostButtonDisabled, setIsPostButtonDisabled] = useState<boolean>(false);

    useEffect(() => {
        setRating(props.initialRating);
    }, [props.initialRating]);

    const handleStarHover = (starIndex:number) => {
        setHoverRating(starIndex + 1);
    };

    const handleStarLeave = () => {
        setHoverRating(0);
    };

    const handleChangeScore = (starIndex:number) => {
        setRating(starIndex + 1);
    }

    function checkFormValidity(): boolean {
        setIsPostButtonDisabled(true);
        setIsPendingAddReview(true);
        setPostReviewError("");
        setReviewTitleErrorMessage("");
        setReviewBodyErrorMessage("");

        if(reviewTitle === "") setReviewTitleErrorMessage("⚠ Title cannot be empty");
        if(reviewBody === "") setReviewBodyErrorMessage("⚠ Body cannot be empty");

        if(reviewTitle === "" || reviewBody === "") {
            setIsPendingAddReview(false);
            setIsPostButtonDisabled(false);
            return false;
        }
        return true;
    }
    function buildReviewObject(): any {
        if(!update)
            return {
                reviewedProduct : {
                    productID: productID
                },
                reviewComment: reviewBody,
                reviewScore: rating,
                reviewTitle: reviewTitle
            }
        else
            return {
                reviewComment: reviewBody,
                reviewTitle: reviewTitle,
                reviewScore: rating
            }
    }

    function handleFetchReview(e:any) {
        e.preventDefault();
        if(!checkFormValidity()) return;
        let reviewObject = buildReviewObject();

        let operation:string = update ? "PUT" : "POST";

        fetch(config.apiUrl + "/review" + (update ? ("/" + review.reviewID) : ""),
            {
                method: operation,
                headers: {
                    "Origin": config.origin,
                    "Authorization": "Bearer " + Cookies.get('jwtToken'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewObject)
            })
            .then((response) => {
                if(!response.ok) throw new Error("Error");
                setIsPendingAddReview(false);
                setIsPostButtonDisabled(false);
                window.location.reload();
            })
            .catch(() => {
                setIsPendingAddReview(false);
                setIsPostButtonDisabled(false);
                setPostReviewError("Error posting review. Please try again")
            })
    }

    return (
        <CustomPopup show={isReviewPopupVisible} onClose={() => setIsReviewPopupVisible(false)}>
            <div id="product-page-add-review-div">
                <div>
                    <div id="product-page-review-section-star-rating">
                        {Array.from({ length: 5 }, (_, index) => (
                            <span
                                key={index}
                                className={`material-symbols-outlined review${hoverRating > index || rating > index ? ' filled' : ''}`}
                                onMouseEnter={() => handleStarHover(index)}
                                onMouseLeave={handleStarLeave}
                                onClick={() => handleChangeScore(index)}
                            >star</span>
                        ))}
                    </div>
                    <span style={{position:"relative", top:-10, fontSize: 22, color: "#ddd"}}>Set a rating</span>
                </div>
                <form id="product-page-reviews-section-form" onSubmit={handleFetchReview}>
                    <input
                        type="text"
                        id="product-page-reviews-section-title-input"
                        placeholder="Enter review title"
                        value={reviewTitle}
                        onChange={(event) => setReviewTitle(event.target.value)}
                    ></input>
                    {reviewTitleErrorMessage && <div className="product-page-review-sections-error-message" style={{position:"relative", top:-5}}>{reviewTitleErrorMessage}</div>}
                    <p id="product-page-reviews-section-comment-p" style={{color: "#ddd"}}>Review:</p>
                    <textarea
                        id="product-page-reviews-section-comment-input"
                        value = {reviewBody}
                        onChange={(event) => setReviewBody(event.target.value)}
                    ></textarea>
                    {reviewBodyErrorMessage && <div className="product-page-review-sections-error-message" style={{position:"relative", top:-5}}>{reviewBodyErrorMessage}</div>}
                    <button id="product-page-reviews-section-submit-button" disabled={isPostButtonDisabled}>{buttonText}</button>
                    {postReviewError && <div className="product-page-review-sections-error-message">{postReviewError}</div>}
                    {isPendingAddReview && <div className="lds-roller review-sections-page" id="product-page-reviews-section-add-review-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>}
                </form>
            </div>
        </CustomPopup>
    )
}

export default ReviewPopup;