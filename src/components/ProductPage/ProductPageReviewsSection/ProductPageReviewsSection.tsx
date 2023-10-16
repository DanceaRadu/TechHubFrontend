import './ProductPageReviewsSection.css'
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ProductReviewElement from "./ProductReviewElement/ProductReviewElement";
import CustomPopup from "../../CustomPopup/CustomPopup";
// @ts-ignore
import Cookies from "js-cookie";

function ProductPageReviewsSection(props:any) {

    const navigate = useNavigate();
    const isLoggedIn = props.isLoggedIn;
    const productData = props.productData;

    const [isPendingVerifyAlreadyReviewed, setIsPendingVerifyAlreadyReviewed] = useState<boolean>(true);
    const [hasAlreadyAddedReview, setHasAlreadyAddedReview] = useState<boolean>(false);
    const [alreadyReviewedError, setAlreadyReviewedError] = useState<string>("");

    //states used for managing the product score. One for when the user hovers over a score, and one for when the user clicks on that score
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [rating, setRating] = useState<number>(0);

    const [isReviewPopupVisible, setIsReviewPopupVisible] = useState<boolean>(false);

    const [reviewTitle, setReviewTitle] = useState<string>("");
    const [reviewBody, setReviewBody] = useState<string>("");

    const [isPendingAddReview, setIsPendingAddReview] = useState<boolean>(false);
    const [postReviewError, setPostReviewError] = useState<string>("");

    const [reviewTitleErrorMessage, setReviewTitleErrorMessage] = useState<string>("");
    const [reviewBodyErrorMessage, setReviewBodyErrorMessage] = useState<string>("");

    const [isPostButtonDisabled, setIsPostButtonDisabled] = useState<boolean>(false);

    //check if the current user has already reviewed this product or not
    useEffect(() => {
        if(isLoggedIn) {
            let userReviews = [];
            fetch("http://localhost:8080/api/v1/user/reviews",
                {
                    method: 'GET',
                    headers: {
                        "Origin": "http://localhost:8080:3000",
                        "Authorization": "Bearer " + Cookies.get('jwtToken'),
                    },
                })
                .then(res => {
                    if(!res.ok) throw Error("Status is not 200");
                    return res.json();
                })
                .then(data => {
                    userReviews = data;
                    for(let i = 0; i < userReviews.length; i++) {
                        if(userReviews[i].reviewedProduct.productID === productData.productID) {
                            setHasAlreadyAddedReview(true);
                            setIsPendingVerifyAlreadyReviewed(false);
                            break;
                        }
                    }
                    setIsPendingVerifyAlreadyReviewed(false);
                })
                .catch(() => {
                    setIsPendingVerifyAlreadyReviewed(false);
                    setHasAlreadyAddedReview(true);
                    setAlreadyReviewedError("Error. Please try again.");
                })
        }
        else {
            setIsPendingVerifyAlreadyReviewed(false);
            setHasAlreadyAddedReview(false);
        }
    }, [isLoggedIn])

    const handleStarHover = (starIndex:number) => {
        setHoverRating(starIndex + 1);
    };

    const handleStarLeave = () => {
        setHoverRating(0);
    };

    const handleChangeScore = (starIndex:number) => {
        setRating(starIndex + 1);
    }

    function handleAddReview(starIndex:number) {
        if(!isLoggedIn) {
            navigate("/login")
        }
        else {
            setPostReviewError("");
            setReviewTitleErrorMessage("");
            setReviewBodyErrorMessage("");
            setRating(starIndex + 1)
            setIsReviewPopupVisible(true);
        }
    }

    function handlePostReview(e:any) {
        e.preventDefault();
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
            return;
        }

        let reviewObject = {
            reviewedProduct : {
                productID: productData.productID
            },
            reviewComment: reviewBody,
            reviewScore: rating,
            reviewTitle: reviewTitle
        }

        fetch("http://localhost:8080/api/v1/review",
            {
                method: 'POST',
                headers: {
                    "Origin": "http://localhost:8080:3000",
                    "Authorization": "Bearer " + Cookies.get('jwtToken'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewObject)
            })
            .then(() => {
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
        <div id="product-page-reviews-section-outer-div">
            <div id="product-page-reviews-section-add-review-div">
                {!isPendingVerifyAlreadyReviewed && !hasAlreadyAddedReview && <div>
                    <p id="product-page-review-section-header">Do you own the product ?</p>
                    <p id="product-page-review-section-sub-header">Write a review and tell others what you think</p>
                    <div>
                        <div id="product-page-review-section-star-rating">
                            {Array.from({ length: 5 }, (_, index) => (
                                <span
                                    key={index}
                                    className={`material-symbols-outlined review${(hoverRating > index) || (rating > index ) ? ' filled' : ''}`}
                                    onMouseEnter={() => handleStarHover(index)}
                                    onMouseLeave={handleStarLeave}
                                    onClick={() => handleAddReview(index)}
                                >star</span>
                            ))}
                        </div>
                        <span id="product-page-review-section-give-score-text">Give the product a score</span>
                    </div>
                    <button className="cover-button" id="product-page-reviews-section-review-button" onClick={() => handleAddReview(0)}>Review</button>
                </div>}
                {!isPendingVerifyAlreadyReviewed && hasAlreadyAddedReview && !alreadyReviewedError &&
                    <div style={{height:145, display:"flex", flexDirection:"column"}}>
                        <div>
                            You have already added a review for this product.
                        </div>
                        <button className="product-page-reviews-manage-reviews-button" onClick={() => navigate("/account/reviews")}>Manage my reviews</button>
                        <button className="product-page-reviews-manage-reviews-button" onClick={() => navigate("/account")}>My account</button>
                    </div>}
                {isPendingVerifyAlreadyReviewed && <div className="lds-roller review-sections-page" style={{left:"46%"}}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>}
                {alreadyReviewedError && <div>{alreadyReviewedError}</div>}
            </div>
            {productData.reviewDTOs.length > 0 && <div id="product-page-reviews-section-reviews-div">
                {productData.reviewDTOs.map((item:any) => (
                        <ProductReviewElement key={item.reviewID} review={item}></ProductReviewElement>
                ))}
            </div>}
            {productData.reviewDTOs.length === 0 && <div style={{marginTop:20}}>No reviews yet.</div>}

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
                        <span style={{position:"relative", top:-10, fontSize: 22}}>Set a rating</span>
                    </div>
                    <form id="product-page-reviews-section-form" onSubmit={handlePostReview}>
                        <input
                            type="text"
                            id="product-page-reviews-section-title-input"
                            placeholder="Enter review title"
                            value={reviewTitle}
                            onChange={(event) => setReviewTitle(event.target.value)}
                        ></input>
                        {reviewTitleErrorMessage && <div className="product-page-review-sections-error-message" style={{position:"relative", top:-5}}>{reviewTitleErrorMessage}</div>}
                        <p id="product-page-reviews-section-comment-p">Review:</p>
                        <textarea
                            id="product-page-reviews-section-comment-input"
                            value = {reviewBody}
                            onChange={(event) => setReviewBody(event.target.value)}
                        ></textarea>
                        {reviewBodyErrorMessage && <div className="product-page-review-sections-error-message" style={{position:"relative", top:-5}}>{reviewBodyErrorMessage}</div>}
                        <button id="product-page-reviews-section-submit-button" disabled={isPostButtonDisabled}>Submit review</button>
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
        </div>
    )
}

export default ProductPageReviewsSection