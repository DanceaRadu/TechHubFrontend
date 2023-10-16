import './ProductReviewElement.css'
import React from "react";
import useFetchImage from "../../../../hooks/useFetchImage";
function ProductReviewElement(props:any) {

    const review = props.review;
    const { imageSourceUrl, error: errorImageFetch, isPending: imageFetchPending } = useFetchImage(review.reviewer.profileImage?.imageID);

    function getFormattedDate(inputDate:string) {
        let date = new Date(inputDate);
        let month:string = "";

        switch(date.getMonth() + 1) {
            case 1:
                month = "Jan.";
                break;
            case 2:
                month = "Feb.";
                break;
            case 3:
                month = "Mar.";
                break;
            case 4:
                month = "Apr.";
                break;
            case 5:
                month = "May.";
                break;
            case 6:
                month = "Jun.";
                break;
            case 7:
                month = "Jul.";
                break;
            case 8:
                month = "Aug.";
                break;
            case 9:
                month = "Sep.";
                break;
            case 10:
                month = "Oct.";
                break;
            case 11:
                month = "Nov.";
                break;
            case 12:
                month = "Dec.";
                break;
        }
        return (date.getDate()) + " " + month + " " + date.getFullYear();
    }

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