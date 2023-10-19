import './MyReview.css'
import React from "react";
import useFetchImage from "../../../../hooks/useFetchImage";
import getFormattedDate from "../../../../functions/getFormattedDate";

function MyReview(props:any) {

    const review = props.review;
    const {imageSourceUrl, error, isPending} = useFetchImage(review.reviewedProduct.productImages[0].image.imageID);

    return (
        <div id="my-review-outer-div">
            <div id="my-review-left-div">
                <div id="my-review-image-outer-div">
                    <img id = "my-review-product-image" src={imageSourceUrl} alt="product"/>
                    <p id="my-review-product-name">{review.reviewedProduct.productName}</p>
                </div>
                <div id="my-review-review-outer-div">
                    <p id="my-review-review-title">{review.reviewTitle}</p>
                    <div>
                        <span className={"material-symbols-outlined review-element-star filled"}>star</span>
                        <span className={"material-symbols-outlined review-element-star" + (review.reviewScore > 1 ? " filled" : "")}>star</span>
                        <span className={"material-symbols-outlined review-element-star" + (review.reviewScore > 2 ? " filled" : "")}>star</span>
                        <span className={"material-symbols-outlined review-element-star" + (review.reviewScore > 3 ? " filled" : "")}>star</span>
                        <span className={"material-symbols-outlined review-element-star" + (review.reviewScore > 4 ? " filled" : "")}>star</span>
                    </div>
                    <p id="my-review-review-body">{review.reviewComment}</p>
                    <p id="my-review-review-time">{getFormattedDate(review.postDate)}</p>
                </div>
            </div>
            <div id="my-review-right-div">

            </div>
        </div>
    )

}

export default MyReview;