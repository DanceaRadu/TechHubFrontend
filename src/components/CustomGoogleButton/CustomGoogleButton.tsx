import './CustomGoogleButton.css'
import React from "react";
function CustomGoogleButton(props:any) {

    let buttonText = props.text;
    let disabled = props.disabled;

    return (
        <button type="button" onClick={props.onClick} className="google-sign-in-button" disabled={disabled}>{buttonText}
            <img id="google-button-logo" src={require('../../resources/icons/google-logo.png')}  alt="Product"/>
        </button>
    )
}

export default CustomGoogleButton;