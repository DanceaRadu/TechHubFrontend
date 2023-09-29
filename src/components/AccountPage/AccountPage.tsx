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

    //if the user is not logged in, redirect them to the login page
    useEffect(() => {
        if(!isPending && !isLoggedIn) {
            navigate("/");
        }
    }, [isPending, isLoggedIn]);

    return (
        <div className = "background-div">
            <Navbar
                isLoggedIn={isLoggedIn}
                isPendingLoggedIn={isPending}
                shoppingCartEntries={props.shoppingCartEntries}
                setShoppingCartEntries = {props.setShoppingCartEntries}>
            </Navbar>
            <div id="account-container-div">
                {false && <div style={{color:'#DDD', fontSize:30, marginBottom:5}}>Account information</div>}
                <div id="account-info-div">
                    <div id ="account-page-image-container">
                        {(isProfilePicturePending || imageError) ? (
                            <Link to="/login">
                                <span className="material-symbols-outlined" id="account-page-user-icon">account_circle</span>
                            </Link>
                        ) : null}
                        {!isProfilePicturePending && !imageError && <img src={imageSourceUrl} id="account-page-user-image"/>}
                    </div>
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
                <div id="test-div"></div>
            </div>
        </div>
    )

}

export default AccountPage
