import './ProductReviewElement.css'
import React, {useEffect} from "react";
function ProductReviewElement(props:any) {

    const review = props.review;

    useEffect(() => {
        console.log(review)
    })

    return (
        <div id="product-review-element-outer-div">
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

            <hr style={{border:"1px solid #333", marginTop:10}}/>
        </div>
    )
}

export default  ProductReviewElement;