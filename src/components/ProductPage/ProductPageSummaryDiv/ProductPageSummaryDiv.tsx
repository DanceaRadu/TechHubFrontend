import './ProductPageSummaryDiv.css'
import React from "react";
function ProductPageSummaryDiv(props:any) {

    const productData = props.productData;

    return (
        <div id="product-page-summary-outer-div">
            <div id="product-page-summary-price-div">
                {Math.floor(productData.productPrice)}<sup>{Math.floor((productData.productPrice - Math.floor(productData.productPrice)) * 100)}</sup> USD
            </div>
        </div>
    )

}

export default ProductPageSummaryDiv;