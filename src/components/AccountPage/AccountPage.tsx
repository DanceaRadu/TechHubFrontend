import React, {useEffect, useState} from "react";
import './AccountPage.css'
import Navbar from "../Navbar/Navbar";
import {useNavigate} from 'react-router-dom';
import useFetchAccountInfo from "../../hooks/useFetchAccountInfo";
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import useFetchProfilePicture from "../../hooks/useFetchProfilePicture";
import ManageProductsPage from "../ManageProductsPage/ManageProductsPage";
import MyReviewsPage from "./MyReviewsPage/MyReviewsPage";
import MyFavoritesPage from "./MyFavoritesPage/MyFavoritesPage";
function AccountPage(this: any, props:any) {

    const navigate = useNavigate();

    const {isLoggedIn, isPending} = useCheckLoggedIn();
    const [accountInfo] = useFetchAccountInfo(isLoggedIn);
    const {imageSourceUrl, error:imageError, isPending:isProfilePicturePending} = useFetchProfilePicture();

    const [navigationOptions, setNavigationOptions] = useState<boolean[]>([false,false,false,false,false,false])

    //if the user is not logged in, redirect them to the login page
    useEffect(() => {
        if(!isPending && !isLoggedIn) {
            navigate("/login");
        }
        setNavigationOptions(props.selectedCategory);
    }, [isPending, isLoggedIn, props.selectedCategory, navigationOptions]);

    function handleOrders() {
        navigate("/account/orders");
    }

    function handleFavorites() {
        navigate("/account/favorites");
    }

    function handleMyReviews() {
        navigate("/account/reviews");
    }

    function handleMyCreditCards() {
        navigate("/account/cards");
    }

    function handleMyAddresses() {
        navigate("/account/addresses");
    }
    function handleManageProducts() {
        navigate("/account/manage/1");
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
                        {!isProfilePicturePending && !imageError && <img src={imageSourceUrl} id="account-page-user-image" alt="user"/>}
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
                        className={navigationOptions[0] ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                        onClick={handleOrders}
                    >Orders</button>
                    <button
                        className={navigationOptions[1] ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                        onClick={handleFavorites}
                    >Favorites</button>
                    <button
                        className={navigationOptions[2] ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                        onClick={handleMyReviews}
                    >My reviews</button>
                    <button
                        className={navigationOptions[3] ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                        onClick={handleMyCreditCards}
                    >My credits cards</button>
                    <button
                        className={navigationOptions[4] ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                        onClick={handleMyAddresses}
                    >My addresses</button>
                    {accountInfo.role === "ADMIN" && <button
                        className={navigationOptions[5] ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                        onClick={handleManageProducts}
                    >Manage Products</button>}
                </div>
                <div id="account-page-side-content-div">
                    {navigationOptions[5] && <ManageProductsPage></ManageProductsPage>}
                    {navigationOptions[2] && <MyReviewsPage></MyReviewsPage>}
                    {navigationOptions[1] && <MyFavoritesPage shoppingCartEntries={props.shoppingCartEntries} setShoppingCartEntries = {props.setShoppingCartEntries}></MyFavoritesPage >}
                </div>
            </div>
        </div>
    )

}

export default AccountPage
