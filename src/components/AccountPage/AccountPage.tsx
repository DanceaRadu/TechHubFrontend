import React, {useEffect, useState} from "react";
import './AccountPage.css'
import Navbar from "../Navbar/Navbar";
import {redirect, useNavigate} from 'react-router-dom';
import useFetchAccountInfo from "../../hooks/useFetchAccountInfo";
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
function AccountPage(props:any) {

    const navigate = useNavigate();

    const {isLoggedIn, isPending} = useCheckLoggedIn();
    const [accountInfo] = useFetchAccountInfo(isLoggedIn)

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
            <div>{accountInfo._username}</div>
        </div>
    )

}

export default AccountPage
