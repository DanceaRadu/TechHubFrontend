import './ProductPageSummaryDiv.css'
import React, {useEffect, useState} from "react";
import addProductToCart from "../../../functions/addProductToCart";
import config from "../../../config";
// @ts-ignore
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
function ProductPageSummaryDiv(props:any) {

    const productData = props.productData;
    const setFavorites = props.setFavorites;
    const favorites = props.favorites;
    const isFavorite = props.isFavorite;
    const [isCartButtonDisabled, setIsCartButtonDisabled] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        let sum:number = 0;
        for(let i = 0; i < productData.productReviews.length; i++) sum = sum + productData.productReviews[i].reviewScore;

        let tempRating = (sum/productData.productReviews.length).toFixed(2);
        setRating(parseFloat(tempRating))
    }, [productData])

    function handleAddToCart() {
        setIsCartButtonDisabled(true);
        addProductToCart(props.isLoggedIn, productData.productID, props.shoppingCartEntries, props.setShoppingCartEntries);
        setIsCartButtonDisabled(false);
    }

    function handleAddToFavorites() {
        if(props.isLoggedIn) {
            fetch(config.apiUrl + "/favorite/" + productData.productID,
                {
                    method: 'POST',
                    headers: {
                        "Origin": config.origin,
                        "Authorization": "Bearer " + Cookies.get('jwtToken')
                    }
                }
            )
                .then(res => {
                    if (!res.ok) throw Error("Could not fetch user favorites");
                    return res.json();
                })
                .then(data => {
                    let newFavoritesList = [...favorites, data];
                    setFavorites(newFavoritesList);
                })
                .catch((e) => {
                    console.log(e.message);
                })
        }
        else navigate("/login");
    }

    function handleRemoveFromFavorites() {
        if(props.isLoggedIn) {
            //find the id of the favorites entry to remove
            for(let i = 0; i < favorites.length; i++) {
                if(productData.productID === favorites[i].productID) {
                    fetch(config.apiUrl + "/favorite/" + favorites[i].favoriteID,
                        {
                            method: 'DELETE',
                            headers: {
                                "Origin": config.origin,
                                "Authorization": "Bearer " + Cookies.get('jwtToken')
                            }
                        }
                    )
                        .then(res => {
                            if (!res.ok) throw Error("Could not fetch user reviews");
                            favorites.splice(i, 1);
                            let newFavoritesList = [...favorites];
                            setFavorites(newFavoritesList)
                        })
                        .catch((e) => {
                            console.log(e.message);
                        })
                    break;
                }
            }
        }
        else navigate("/login");
    }

    return (
        <div id="product-page-summary-outer-div">
            <div id="product-page-summary-upper-div">
                <div id="product-page-summary-price-div">
                    {Math.floor(productData.productPrice)}<sup>{Math.floor((productData.productPrice - Math.floor(productData.productPrice)) * 100)}</sup>$
                    <div id="product-summary-stock-div">{productData.stock} left in stock</div>
                </div>
                <div id="product-page-summary-reviews-div">{isNaN(rating) ? "Not rated" : rating + "/5"} {!isNaN(rating) && <span className="material-symbols-outlined" id="product-preview-star-icon">star</span>}<br/>{"(" + productData.productReviews.length + (productData.productReviews.length > 1 ?" reviews)" : " review)")}</div>
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
                {!isFavorite && <button
                    className="cover-button"
                    onClick={handleAddToFavorites}>
                    <span className="material-symbols-outlined" id="product-page-summary-favorites-icon">favorite</span>
                    Add to favorites
                </button>}
                {isFavorite && <button
                    className="cover-button"
                    onClick={handleRemoveFromFavorites}>
                    <span className="material-symbols-outlined" id="product-page-summary-favorites-remove-icon">favorite</span>
                    Remove from favorites
                </button>}
            </div>
        </div>
    )

}

export default ProductPageSummaryDiv;