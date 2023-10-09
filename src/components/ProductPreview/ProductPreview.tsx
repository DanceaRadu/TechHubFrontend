import './ProductPreview.css'
import Product from "../../models/Product";
import React, {useState} from "react";
import useFetchImage from "../../hooks/useFetchImage";
import {useNavigate} from 'react-router-dom';
import addProductToCart from "../../functions/addProductToCart";

function ProductPreview(props: any) {

    let product:Product = props.product;
    let shoppingCartEntries = props.shoppingCartEntries;
    let setShoppingCartEntries = props.setShoppingCartEntries;
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const imageID = product?.productImages[0]?.image?.imageID;
    const { imageSourceUrl, error: imageFetchError, isPending: isPendingImage } = useFetchImage(imageID);

    const navigate = useNavigate();

    function handleAddToCart(e:any) {
        setIsButtonDisabled(true);
        e.stopPropagation();
        addProductToCart(props.isLoggedIn, product.productID, shoppingCartEntries, setShoppingCartEntries);
        setIsButtonDisabled(false);
    }


    function handleAddToFavorites(e:any) {
        e.stopPropagation();
    }

    return (
        <div id = "product-preview-container" onClick={() => navigate("/product/" + product.productID)}>
            <div>
                <span className="material-symbols-outlined" id="product-preview-favorite-icon" onClick={handleAddToFavorites}>favorite</span>
                {!imageFetchError && !isPendingImage && <img id="product-preview-image" src={imageSourceUrl} alt="Product"/>}
                {isPendingImage || imageFetchError ? (
                    <img id="product-preview-image" src={require('../../resources/images/product-placeholder.jpg')}  alt="Product"/>
                ) : null}
            </div>
            <p id="product-preview-name">{product.productName}</p>
            <div id="product-preview-price-div">
                <p id="product-preview-price">{Math.floor(product.productPrice)}<sup>{Math.floor((product.productPrice - Math.floor(product.productPrice)) * 100)}</sup> USD</p>
                <div id="product-preview-score-div">4.5/5<span className="material-symbols-outlined" id="product-preview-star-icon">star</span></div>
            </div>
            <button className="cover-button" id="product-preview-cart-button" onClick={handleAddToCart} disabled={isButtonDisabled}>
                <span className="material-symbols-outlined" id="product-preview-shopping-cart-icon">shopping_cart</span>Add to cart</button>
        </div>

    )
}

export default ProductPreview;