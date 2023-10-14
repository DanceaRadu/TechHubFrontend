import './ProductReviewElement.css'
function ProductReviewElement(props:any) {

    const review = props.review;

    return (
        <div>
            {review.reviewComment}
        </div>
    )
}

export default  ProductReviewElement;