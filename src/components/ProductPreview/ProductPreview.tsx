import './ProductPreview.css'
import React, {useEffect, useState} from "react";
import useFetchImage from "../../hooks/useFetchImage";
import {useNavigate} from 'react-router-dom';
import addProductToCart from "../../functions/addProductToCart";
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import useCheckIsProductFavorite from "../../hooks/useCheckIsProductFavorite";
import config from "../../config";
// @ts-ignore
import Cookies from "js-cookie";

function ProductPreview(props: any) {

    let product = props.product;
    let shoppingCartEntries = props.shoppingCartEntries;
    let setShoppingCartEntries = props.setShoppingCartEntries;
    let favorites = props.favorites;
    let setFavorites = props.setFavorites;
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const {isLoggedIn, isPending:isPendingLoggedIn} = useCheckLoggedIn();

    const imageID = product?.productImages[0]?.image?.imageID;
    const { imageSourceUrl, error: imageFetchError, isPending: isPendingImage } = useFetchImage(imageID);
    const {isFavorite} = useCheckIsProductFavorite(product.productID, favorites);

    const [rating, setRating] = useState<number>(0);

    const navigate = useNavigate();

    useEffect(() => {
        let sum:number = 0;
        for(let i = 0; i < product.productReviews.length; i++) sum = sum + product.productReviews[i].reviewScore;
        let tempRating = (sum/product.productReviews.length).toFixed(2);
        setRating(parseFloat(tempRating))
    }, [product])

    function handleAddToCart(e:any) {
        setIsButtonDisabled(true);
        e.stopPropagation();
        addProductToCart(props.isLoggedIn, product.productID, shoppingCartEntries, setShoppingCartEntries);
        setIsButtonDisabled(false);
    }

    function handleAddToFavorites(e:any) {
        e.stopPropagation();
        if(isLoggedIn) {
            fetch(config.apiUrl + "/favorite/" + product.productID,
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
        else if(!isPendingLoggedIn) navigate("/login");
    }

    function handleRemoveFromFavorites(e:any) {
        e.stopPropagation();
        if(isLoggedIn) {
            //find the id of the favorites entry to remove
            for(let i = 0; i < favorites.length; i++) {
                if(product.productID === favorites[i].productID) {
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
        else if(!isPendingLoggedIn) navigate("/login");
    }

    return (
        <div id = "product-preview-container" onClick={() => navigate("/product/" + product.productID)}>
            <div>
                {!isFavorite && <span className="material-symbols-outlined" id="product-preview-favorite-icon" onClick={handleAddToFavorites}>favorite</span>}
                {isFavorite &&
                        <span className="material-symbols-outlined" id="product-preview-favorite-icon-favorite" onClick={handleRemoveFromFavorites}>
                            favorite
                            <span className="material-symbols-outlined" id="product-preview-favorite-icon-x-icon" onClick={handleRemoveFromFavorites}>close</span>
                        </span>
                }
                {!imageFetchError && !isPendingImage && <img id="product-preview-image" src={imageSourceUrl} alt="Product"/>}
                {isPendingImage || imageFetchError ? (
                    <img id="product-preview-image" src={require('../../resources/images/product-placeholder.jpg')}  alt="Product"/>
                ) : null}
            </div>
            <p id="product-preview-name">{product.productName}</p>
            <div id="product-preview-price-div">
                <p id="product-preview-price">{Math.floor(product.productPrice)}<sup>{Math.floor((product.productPrice - Math.floor(product.productPrice)) * 100)}</sup> USD</p>
                <div id="product-preview-score-div">{product.productReviews.length > 0 ? rating + "/5" : "Not rated"}{<span className="material-symbols-outlined" id="product-preview-star-icon">star</span>}{product.productReviews.length > 0 ? `(${product.productReviews.length})` : ""}</div>
            </div>
            <button className="cover-button" id="product-preview-cart-button" onClick={handleAddToCart} disabled={isButtonDisabled}>
                <span className="material-symbols-outlined" id="product-preview-shopping-cart-icon">shopping_cart</span>Add to cart</button>
        </div>
    )
}

export default ProductPreview;