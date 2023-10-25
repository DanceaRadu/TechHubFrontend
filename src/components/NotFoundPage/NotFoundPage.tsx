import './NotFoundPage.css'
import {useNavigate} from "react-router-dom";
import React from "react";

function NotFoundPage() {

    const navigate = useNavigate();

    return (
        <div className="background-div">
            <div id="not-found-page-div">
                <img id="not-found-page-image" src={require('../../resources/images/notFoundImage.png')}  alt="Product"/>
                <p style={{fontSize:100, color:"#DDD"}}>404</p>
                <p style={{fontSize:20, color:"#DDD"}}>This isn't the page you're looking for...</p>
                <button id="not-found-page-go-home-button" onClick={() => navigate("/")}>Go home</button>
            </div>
        </div>
    )

}

export default NotFoundPage