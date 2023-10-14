import './ProductPageReviewsSection.css'
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import ProductReviewElement from "./ProductReviewElement/ProductReviewElement";

function ProductPageReviewsSection(props:any) {

    const isLoggedIn = props.isLoggedIn;
    const productReviews = props.productReviews;
    const [rating, setRating] = useState<number>(0);
    const navigate = useNavigate();


    const handleStarHover = (starIndex:number) => {
        setRating(starIndex + 1);
    };

    const handleStarLeave = () => {
        setRating(0);
    };

    function handleAddReview() {
        if(!isLoggedIn) {
            navigate("/login")
        }
        else {
            console.log("Reviewed");
        }
    }

    return (
        <div id="product-page-reviews-section-outer-div">
            <div id="product-page-reviews-section-add-review-div">
                <p id="product-page-review-section-header">Do you own the product ?</p>
                <p id="product-page-review-section-sub-header">Write a review and tell others what you think</p>
                <div>
                    <div id="product-page-review-section-star-rating">
                        {Array.from({ length: 5 }, (_, index) => (
                            <span
                                key={index}
                                className={`material-symbols-outlined review${rating > index ? ' filled' : ''}`}
                                onMouseEnter={() => handleStarHover(index)}
                                onMouseLeave={handleStarLeave}
                                onClick={handleAddReview}
                            >star</span>
                        ))}
                    </div>
                    <span id="product-page-review-section-give-score-text">Give the product a score</span>
                </div>
                <button className="cover-button" id="product-page-reviews-section-review-button" onClick={handleAddReview}>Review</button>
            </div>
            {productReviews.length > 0 && <div id="product-page-reviews-section-reviews-div">
                {productReviews.map((item:any) => (
                        <ProductReviewElement key={item.reviewID} review={item}></ProductReviewElement>
                ))}
            </div>}
            {productReviews.length === 0 && <div style={{marginTop:20}}>No reviews yet.</div>}

        </div>
    )

}

export default ProductPageReviewsSection