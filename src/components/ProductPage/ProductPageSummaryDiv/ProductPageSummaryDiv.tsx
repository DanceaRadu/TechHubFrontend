import './ProductPageSummaryDiv.css'
import React, {useState} from "react";
import addProductToCart from "../../../functions/addProductToCart";
function ProductPageSummaryDiv(props:any) {

    const productData = props.productData;
    const [isCartButtonDisabled, setIsCartButtonDisabled] = useState<boolean>(false);

    function handleAddToCart() {
        setIsCartButtonDisabled(true);
        addProductToCart(props.isLoggedIn, productData.productID, props.shoppingCartEntries, props.setShoppingCartEntries);
        setIsCartButtonDisabled(false);
    }

    return (
        <div id="product-page-summary-outer-div">
            <div id="product-page-summary-upper-div">
                <div id="product-page-summary-price-div">
                    {Math.floor(productData.productPrice)}<sup>{Math.floor((productData.productPrice - Math.floor(productData.productPrice)) * 100)}</sup>$
                    <div id="product-summary-stock-div">{productData.stock} left in stock</div>
                </div>
                <div id="product-page-summary-reviews-div">4.5/5 <span className="material-symbols-outlined" id="product-preview-star-icon">star</span><br/>(12 reviews)</div>
            </div>
            <div id="product-page-summary-button-div">
                <button
                    disabled={isCartButtonDisabled}
                    className="cover-button"
                    onClick={handleAddToCart}>
                    <span
                    className="material-symbols-outlined"
                    id="product-page-summary-shopping-cart-icon">
                    shopping_cart</span>  Add to cart</button>
                <button className="cover-button"><span className="material-symbols-outlined" id="product-page-summary-favorites-icon">favorite</span>  Add to favorites</button>
            </div>
        </div>
    )

}

export default ProductPageSummaryDiv;