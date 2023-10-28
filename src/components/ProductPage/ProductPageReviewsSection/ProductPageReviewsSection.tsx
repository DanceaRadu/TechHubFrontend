import './ProductPageReviewsSection.css'
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ProductReviewElement from "./ProductReviewElement/ProductReviewElement";
// @ts-ignore
import Cookies from "js-cookie";
import config from "../../../config";
import ReviewPopup from "../../ReviewPopup/ReviewPopup";

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

    //check if the current user has already reviewed this product or not
    useEffect(() => {
        if(isLoggedIn) {
            let userReviews = [];
            fetch(config.apiUrl + "/user/reviews",
                {
                    method: 'GET',
                    headers: {
                        "Origin": config.origin,
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

    function handleAddReview(starIndex:number) {
        if(!isLoggedIn) {
            navigate("/login")
        }
        else {
            setRating(starIndex + 1)
            setIsReviewPopupVisible(true);
        }
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

            <ReviewPopup
                isReviewPopupVisible = {isReviewPopupVisible}
                setIsReviewPopupVisible = {setIsReviewPopupVisible}
                initialRating = {rating}
                initialBody = {""}
                initialTitle = {""}
                buttonText = "Post review"
                productID = {productData.productID}
                update = {false}
            ></ReviewPopup>
        </div>
    )
}

export default ProductPageReviewsSection