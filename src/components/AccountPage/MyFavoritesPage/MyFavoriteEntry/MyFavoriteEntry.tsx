import './MyFavoriteEntry.css'
import useFetchImage from "../../../../hooks/useFetchImage";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import addProductToCart from "../../../../functions/addProductToCart";
import config from "../../../../config";
// @ts-ignore
import Cookies from "js-cookie";

function MyFavoriteEntry(props:any) {

    const favoriteEntry = props.favoriteEntry;
    const favorites = props.favorites;
    const setFavorites = props.setFavorites;
    const {imageSourceUrl, error, isPending} = useFetchImage(favoriteEntry.product.productImages[0].image.imageID);
    const [rating, setRating] = useState<number>(0);

    const [isLoadingRemove, setIsLoadingRemove] = useState<boolean>(false);

    function handleRemoveFavorite() {

        setIsLoadingRemove(true);
        //find the id of the favorites entry to remove
        for(let i = 0; i < favorites.length; i++) {
            if(favoriteEntry.product.productID === favorites[i].productID) {
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
                        if (!res.ok) throw Error("Could not remove favorite entry");
                        favorites.splice(i, 1);
                        let newFavoritesList = [...favorites];
                        setFavorites(newFavoritesList);
                        setIsLoadingRemove(false);
                    })
                    .catch((e) => {
                        console.log(e.message);
                        setIsLoadingRemove(false);
                    })
                break;
            }
        }
    }

    useEffect(() => {
        let sum: number = 0;
        for (let i = 0; i < favoriteEntry.product.productReviews.length; i++) sum = sum + favoriteEntry.product.productReviews[i].reviewScore;
        let tempRating = (sum / favoriteEntry.product.productReviews.length).toFixed(2);
        setRating(parseFloat(tempRating))
    }, [favoriteEntry])


    return (
        <div id="my-favorite-entry-outer-div">
            <Link to={"/product/" + favoriteEntry.product.productID}>
                <div id="my-favorite-entry-left-div">
                    {!isPending && !error && <img id = "my-favorite-entry-product-image" src={imageSourceUrl} alt="product"/>}
                    {isPending || error ? (
                        <img id="my-favorite-entry-image-outer-div-placeholder" src={require('../../../../resources/images/product-placeholder.jpg')}  alt="Product"/>
                    ) : null}
                </div>
            </Link>
            <div id="my-favorite-entry-right-div">
                <div id="my-favorite-entry-name-div">
                    <p id="my-favorite-entry-name">{favoriteEntry.product.productName}</p>
                    <div id="my-favorite-entry-score-div">
                        {favoriteEntry.product.productReviews.length > 0 ? rating + "/5"  : ""}
                        {favoriteEntry.product.productReviews.length > 0 && <span className="material-symbols-outlined" id="my-favorite-entry-star-icon">star</span>}
                        {favoriteEntry.product.productReviews.length > 0 ? "(from " + favoriteEntry.product.productReviews.length + (favoriteEntry.product.productReviews.length > 1 ? " reviews)" : " review)") : ""}
                    </div>
                </div>
                <div id = "my-favorite-entry-vertical-line"></div>
                <div id="my-favorite-entry-buttons-div">
                    {!isLoadingRemove && <p id="my-favorite-entry-price-p">{Math.floor(favoriteEntry.product.productPrice)}<sup>{Math.floor((favoriteEntry.product.productPrice - Math.floor(favoriteEntry.product.productPrice)) * 100)}</sup>$</p>}
                    {!isLoadingRemove && <button id="my-favorite-entry-add-to-cart-button" onClick={() => addProductToCart(props.isLoggedIn, favoriteEntry.product.productID, props.shoppingCartEntries, props.setShoppingCartEntries)}>
                        <span className="material-symbols-outlined" id="product-preview-shopping-cart-icon">shopping_cart</span>
                        Add to cart
                    </button>}
                    {!isLoadingRemove && <div id="product-preview-delete-div" onClick={handleRemoveFavorite}>Delete <span className="material-symbols-outlined">delete</span></div>}
                    {isLoadingRemove && <div className="lds-roller" id="my-favorites-entry-delete-loading-animation">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default MyFavoriteEntry