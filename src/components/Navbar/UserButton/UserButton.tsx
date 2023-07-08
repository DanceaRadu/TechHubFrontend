import "./UserButton.css"
import useFetchProfilePicture from "../../../hooks/useFetchProfilePicture";
import React from "react";
import {Link} from "react-router-dom";

function UserButton() {

    const {imageSourceUrl, error, isPending} = useFetchProfilePicture();

    return (
        <div id = "user-button">
            {(isPending || error) ? (
                <Link to="/Login">
                    <span className="material-symbols-outlined" id="user-button-icon">account_circle</span>
                </Link>
            ) : null}
            <img src={imageSourceUrl} id="user-button-image" alt="profile"/>
        </div>
    );
}

export default UserButton;