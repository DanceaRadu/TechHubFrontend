import './RegistrationPage.css'
import React from "react";

function RegistrationPage(props: any) {
    return (
        <div className="background-div" id = "registration-page-background">
            <div id="registration-page-form-container">
                <h1>
                    <span style={{color: 'black'}}>Tech</span>
                    <span style={{color: 'purple'}}>Hub</span>
                </h1>
                    <form id="registration-page-form">
                        <div id="registration-form-name-div">
                            <div id="registration-form-firstname-div">
                                <span className="material-symbols-outlined" id="registration-firstname-icon">person</span>
                                <input
                                    id="registration-form-firstname"
                                    type="text"
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div id="registration-form-lastname-div">
                                <span className="material-symbols-outlined" id="registration-lastname-icon">person</span>
                                <input
                                    id="registration-form-lastname"
                                    type="text"
                                    placeholder="Enter last name"
                                />
                            </div>
                        </div>
                        <div id="registration-form-username-div">
                            <span className="material-symbols-outlined" id="registration-username-icon">person_4</span>
                            <input
                                id="registration-form-username"
                                type="text"
                                placeholder="Enter username"
                            />
                        </div>
                        <div id="registration-form-email-div">
                            <span className="material-symbols-outlined" id="registration-email-icon">mail</span>
                            <input
                                id="registration-form-email"
                                type="text"
                                placeholder="Enter e-mail"
                            />
                        </div>
                        <div id="registration-form-password-div">
                            <span className="material-symbols-outlined" id="registration-password-icon">lock</span>
                            <input
                                id="registration-form-password"
                                type="password"
                                placeholder="Enter password"
                            />
                        </div>
                        <div id="registration-form-confirm-div">
                            <span className="material-symbols-outlined" id="registration-confirm-icon">lock</span>
                            <input
                                id="registration-form-confirm"
                                type="password"
                                placeholder="Confirm password"
                            />
                        </div>
                        <button className="cover-button" id="register-page-register-button">Register</button>
                    </form>
            </div>
        </div>
    )
}

export default RegistrationPage;