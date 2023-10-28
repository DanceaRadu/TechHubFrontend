import './MyReviewsPage.css'
import React from "react";
import useFetchUserReviews from "../../../hooks/useFetchUserReviews";
import MyReview from "./MyReview/MyReview";

function MyReviewsPage(){

    const {reviews, error, isPending} = useFetchUserReviews();

    return (
      <div id="my-reviews-page-outer-div">
          {isPending && !error &&
              <div className="lds-roller" id="my-reviews-page-loading-animation">
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
          {error && <p id="my-reviews-page-error-message">{error}</p>}
          {!isPending && !error && <p id="my-reviews-page-header">My reviews</p>}
          {!isPending && !error && reviews.map((review:any, index:number) => (
              <div key={review.reviewedProduct.productID}>
                  <MyReview review = {review}></MyReview>
                  {(index+1) !== reviews.length && <hr style={{border: "1px solid #222"}}/>}
              </div>
          ))}
      </div>
    );
}

export default MyReviewsPage;

