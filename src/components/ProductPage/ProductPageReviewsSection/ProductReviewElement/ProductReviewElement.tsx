import './ProductReviewElement.css'
import React from "react";
import useFetchImage from "../../../../hooks/useFetchImage";
import getFormattedDate from "../../../../functions/getFormattedDate";
function ProductReviewElement(props:any) {

    const review = props.review;
    const { imageSourceUrl, error: errorImageFetch, isPending: imageFetchPending } = useFetchImage(review.reviewer.profileImage?.imageID);

    return (
        <div id="product-review-element-outer-div">
            <div style={{display:"flex", flexDirection:"row"}}>
                <div id = "product-review-element-user-info-div">
                    {(imageFetchPending || errorImageFetch) ? (
                        <span className="material-symbols-outlined" id="product-review-element-account-circle">account_circle</span>
                    ) : null}
                    {!imageFetchPending && !errorImageFetch && <img src={imageSourceUrl} id="product-review-element-account-image" alt="user"/>}
                    <p style={{fontSize:18, marginLeft:5, marginTop:5, color:"#FFF"}}>{review.reviewer._username}</p>
                    <p style={{fontSize:18, marginLeft:5, marginTop:5}}>{
                        getFormattedDate(review.postDate)
                    }</p>

                </div>

                <div id="product-review-element-inner-div">
                    <div style={{fontSize:22, color: "white"}}>{review.reviewTitle}</div>
                    <div>
                        <span className={"material-symbols-outlined review-element-star filled"}>star</span>
                        <span className={"material-symbols-outlined review-element-star" + (review.reviewScore > 1 ? " filled" : "")}>star</span>
                        <span className={"material-symbols-outlined review-element-star" + (review.reviewScore > 2 ? " filled" : "")}>star</span>
                        <span className={"material-symbols-outlined review-element-star" + (review.reviewScore > 3 ? " filled" : "")}>star</span>
                        <span className={"material-symbols-outlined review-element-star" + (review.reviewScore > 4 ? " filled" : "")}>star</span>
                    </div>
                    <div style={{fontSize:20}}>{review.reviewComment}</div>
                </div>
            </div>
            <hr style={{border:"1px solid #333", marginTop:10}}/>
        </div>
    )
}

export default  ProductReviewElement;