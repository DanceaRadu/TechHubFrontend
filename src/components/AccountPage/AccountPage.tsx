import React, {useEffect, useState} from "react";
import './AccountPage.css'
import Navbar from "../Navbar/Navbar";
import {Link, redirect, useNavigate} from 'react-router-dom';
import useFetchAccountInfo from "../../hooks/useFetchAccountInfo";
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import useFetchProfilePicture from "../../hooks/useFetchProfilePicture";
function AccountPage(props:any) {

    const navigate = useNavigate();

    const {isLoggedIn, isPending} = useCheckLoggedIn();
    const [accountInfo] = useFetchAccountInfo(isLoggedIn);
    const {imageSourceUrl, error:imageError, isPending:isProfilePicturePending} = useFetchProfilePicture();

    const [isOrdersClicked, setIsOrdersClicked] = useState<boolean>(true);
    const [isFavoritesClicked, setIsFavoritesClicked] = useState<boolean>(false);
    const [isReviewsClicked, setIsReviewsClicked] = useState<boolean>(false);
    const [isCreditCardsClicked, setIsCreditCardsClicked] = useState<boolean>(false);
    const [isAddressesClicked, setIsAddressesClicked] = useState<boolean>(false);
    const [isManageProductsClicked, setIsManageProductsClicked] = useState<boolean>(false);

    //if the user is not logged in, redirect them to the login page
    useEffect(() => {
        if(!isPending && !isLoggedIn) {
            navigate("/");
        }
    }, [isPending, isLoggedIn]);

    function handleOrders() {
        setIsOrdersClicked(true);
        setIsFavoritesClicked(false);
        setIsReviewsClicked(false);
        setIsCreditCardsClicked(false);
        setIsAddressesClicked(false);
        setIsManageProductsClicked(false);
    }

    function handleFavorites() {
        setIsOrdersClicked(false);
        setIsFavoritesClicked(true);
        setIsReviewsClicked(false);
        setIsCreditCardsClicked(false);
        setIsAddressesClicked(false);
        setIsManageProductsClicked(false);
    }

    function handleMyReviews() {
        setIsOrdersClicked(false);
        setIsFavoritesClicked(false);
        setIsReviewsClicked(true);
        setIsCreditCardsClicked(false);
        setIsAddressesClicked(false);
        setIsManageProductsClicked(false);
    }

    function handleMyCreditCards() {
        setIsOrdersClicked(false);
        setIsFavoritesClicked(false);
        setIsReviewsClicked(false);
        setIsCreditCardsClicked(true);
        setIsAddressesClicked(false);
        setIsManageProductsClicked(false);
    }

    function handleMyAddresses() {
        setIsOrdersClicked(false);
        setIsFavoritesClicked(false);
        setIsReviewsClicked(false);
        setIsCreditCardsClicked(false);
        setIsAddressesClicked(true);
        setIsManageProductsClicked(false);
    }
    function handleManageProducts() {
        setIsOrdersClicked(false);
        setIsFavoritesClicked(false);
        setIsReviewsClicked(false);
        setIsCreditCardsClicked(false);
        setIsAddressesClicked(false);
        setIsManageProductsClicked(true);
    }

    return (
        <div className = "background-div">
            <Navbar
                isLoggedIn={isLoggedIn}
                isPendingLoggedIn={isPending}
                shoppingCartEntries={props.shoppingCartEntries}
                setShoppingCartEntries = {props.setShoppingCartEntries}>
            </Navbar>
            <div id="account-container-div">
                <div id="account-info-div">
                    <div id ="account-page-image-container">
                        {(isProfilePicturePending || imageError) ? (
                                <span className="material-symbols-outlined" id="account-page-user-icon">account_circle</span>
                        ) : null}
                        {!isProfilePicturePending && !imageError && <img src={imageSourceUrl} id="account-page-user-image"/>}
                    </div>
                    <div id="account-page-info-inner-div">
                        <div id="account-page-info-keys-div">
                            <div>username:</div>
                            <div>name:</div>
                            <div>e-mail:</div>
                            <div>phone number:</div>
                        </div>
                        <div id="account-page-info-values-div">
                            <div>{accountInfo._username}</div>
                            <div>{accountInfo.firstName + " " + accountInfo.lastName}</div>
                            <div>{accountInfo.email}</div>
                            <div>no phone number</div>
                            <button id="account-page-email-button">Add phone number</button>
                        </div>
                    </div>
                    <br/>
                    <hr style={{backgroundColor:"black", height:2, border:"none"}}/>
                    <button
                        className={isOrdersClicked ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                        onClick={handleOrders}
                    >Orders</button>
                    <button
                        className={isFavoritesClicked ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                        onClick={handleFavorites}
                    >Favorites</button>
                    <button
                        className={isReviewsClicked ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                        onClick={handleMyReviews}
                    >My reviews</button>
                    <button
                        className={isCreditCardsClicked ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                        onClick={handleMyCreditCards}
                    >My credits cards</button>
                    <button
                        className={isAddressesClicked ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                        onClick={handleMyAddresses}
                    >My addresses</button>
                    {accountInfo.role === "ADMIN" && <button
                        className={isManageProductsClicked ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                        onClick={handleManageProducts}
                    >Manage Products</button>}
                </div>
                <div id="test-div"></div>
            </div>
        </div>
    )

}

export default AccountPage
