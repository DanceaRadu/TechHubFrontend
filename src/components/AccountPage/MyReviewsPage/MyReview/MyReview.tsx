import './MyReview.css'
import React, {useState} from "react";
import useFetchImage from "../../../../hooks/useFetchImage";
import getFormattedDate from "../../../../functions/getFormattedDate";
import {Link} from "react-router-dom";
import config from "../../../../config";
// @ts-ignore
import Cookies from "js-cookie";

function MyReview(props:any) {

    const review = props.review;
    const {imageSourceUrl, error, isPending} = useFetchImage(review.reviewedProduct.productImages[0].image.imageID);

    const [isPendingDelete, setIsPendingDelete] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string>("")

    function handleReviewDelete() {

        setIsPendingDelete(true);
        setDeleteError("");

        fetch(config.apiUrl + "/review/" + review.reviewID,
            {
                method: 'DELETE',
                headers: {
                    "Origin": config.origin,
                    "Authorization": "Bearer " + Cookies.get('jwtToken')
                }
            }
        )
            .then(res => {
                if (!res.ok) throw Error("Could not delete user review");
                setIsPendingDelete(false);
                window.location.reload();
            })
            .catch((e) => {
                setDeleteError(e.message);
                setIsPendingDelete(false);
            })
    }

    return (
        <div id="my-review-outer-div">
            <div id="my-review-left-div">
                <Link to={"/product/" + review.reviewedProduct.productID}>
                    <div id="my-review-image-outer-div">
                        {!isPending && !error && <img id = "my-review-product-image" src={imageSourceUrl} alt="product"/>}
                        {isPending || error ? (
                            <img id="my-review-image-outer-div-placeholder" src={require('../../../../resources/images/product-placeholder.jpg')}  alt="Product"/>
                        ) : null}
                        <p id="my-review-product-name">{review.reviewedProduct.productName}</p>
                    </div>
                </Link>
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
                {!isPendingDelete && <div id="my-review-right-div-inner">
                    <button id="my-review-edit-button">Edit</button>
                    <button id="my-review-delete-button" onClick={handleReviewDelete}>Delete</button>
                </div>}
                {isPendingDelete &&
                    <div className="lds-roller" id="my-review-page-loading-animation">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                }
            </div>
        </div>
    )

}

export default MyReview;