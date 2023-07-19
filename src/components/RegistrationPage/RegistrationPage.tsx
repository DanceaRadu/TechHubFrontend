import './RegistrationPage.css'
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import RegisterRequest from "../../models/RegisterRequest";
// @ts-ignore
import Cookies from "js-cookie";

function RegistrationPage(props: any) {

    const navigate = useNavigate();

    //states and functions for changing the style of the divs
    const [isUserFocused, setUserFocused] = useState<boolean>(false);
    const [isPasswordFocused, setPasswordFocused] = useState<boolean>(false);
    const [isConfirmFocused, setConfirmFocused] = useState<boolean>(false);
    const [isFirstNameFocused, setFirstNameFocused] = useState<boolean>(false);
    const [isLastNameFocused, setLastNameFocused] = useState<boolean>(false);
    const [isEmailFocused, setEmailFocused] = useState<boolean>(false);

    const handleUserFocus = () => {
        setUserFocused(true);
    };

    const handleUserBlur = () => {
        setUserFocused(false);
    };

    const handlePasswordFocus = () => {
        setPasswordFocused(true);
    };

    const handlePasswordBlur = () => {
        setPasswordFocused(false);
    };

    const handleConfirmFocus = () => {
        setConfirmFocused(true);
    };

    const handleConfirmBlur = () => {
        setConfirmFocused(false);
    };

    const handleEmailFocus = () => {
        setEmailFocused(true);
    };

    const handleEmailBlur = () => {
        setEmailFocused(false);
    };

    const handleFirstNameFocus = () => {
        setFirstNameFocused(true);
    };

    const handleFirstNameBlur = () => {
        setFirstNameFocused(false);
    };

    const handleLastNameFocus = () => {
        setLastNameFocused(true);
    };

    const handleLastNameBlur = () => {
        setLastNameFocused(false);
    };

    //states and functions for setting the error messages
    const [nameErrorMessage, setNameErrorMessage] = useState<string>("");
    const [userErrorMessage, setUserErrorMessage] = useState<string>("");
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
    const [confirmErrorMessage, setConfirmErrorMessage] = useState<string>("");
    const [newEmailErrorMessage, setNewEmailErrorMessage] = useState<string>("");

    //functions and states for getting and changing the user input
    const [firstNameInput, setFirstNameInput] = useState<string>('');
    const [lastNameInput, setLastNameInput] = useState<string>('');
    const [usernameInput, setUsernameInput] = useState<string>('');
    const [emailInput, setEmailInput] = useState<string>('');
    const [passwordInput, setPasswordInput] = useState<string>('');
    const [confirmInput, setConfirmInput] = useState<string>('');
    const [newEmailInput, setNewEmailInput] = useState<string>('');

    //for disabling the button when the user clicks it
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const [isNewEmailButtonDisabled, setIsNewEmailButtonDisabled] = useState<boolean>(false);
    const [newEmailButtonCountdown, setNewEmailButtonCountdown] = useState<number>(0);

    //for displaying loading animation and errors
    const [fetchError, setFetchError] = useState<string>('');
    const [isPending, setIsPending] = useState<boolean>(false);
    const [emailNotificationMessage, setEmailNotificationMessage] = useState<string>('');

    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/);
    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,64}$/);

    const [jwtToken, setJwtToken] = useState<string>('');

    function handleRegistrationSubmit(e:any) {
        setIsPending(true);
        e.preventDefault();
        setIsButtonDisabled(true);

        setNameErrorMessage('');
        setUserErrorMessage('');
        setEmailErrorMessage('');
        setPasswordErrorMessage('');
        setConfirmErrorMessage('');

        let ok:boolean = true;

        //check that the fields are not empty
        if(firstNameInput === '' || lastNameInput === '') {
            setNameErrorMessage("Cannot leave name fields empty");
            ok = false;
        }

        //check that the fields follow a certain regex
        if(usernameInput.indexOf(" ") > 0 || usernameInput.length > 40 || usernameInput.length < 4) {
            setUserErrorMessage("Username cannot contain spaces, and must be between 4 and 40 characters long");
            ok = false;
        }
        if(!emailRegex.test(emailInput)) {
            setEmailErrorMessage("Not a valid email");
            ok = false;
        }
        if(!passwordRegex.test(passwordInput)) {
            setPasswordErrorMessage("Password must be between 8 and 64 characters long and have at least one uppercase letter, one lowercase letter and one number.");
            ok = false;
        }

        if(passwordInput !== confirmInput) {
            setConfirmErrorMessage("Passwords do not match");
            ok = false;
        }

        if(!ok) {
            setIsPending(false);
            setIsButtonDisabled(false);
            return;
        }

        //trim username, first name, last name and email
        setUsernameInput(usernameInput.trim());
        setFirstNameInput(firstNameInput.trim());
        setLastNameInput(lastNameInput.trim());
        setEmailInput(emailInput.trim());

        setFetchError('');
        fetch("http://localhost:8080/api/v1/auth/register",
            {
                method: 'POST',
                headers: {
                    "Origin": "http://localhost:8080:3000",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(new RegisterRequest(usernameInput, emailInput, passwordInput, firstNameInput, lastNameInput))
            }
        )
            .then(res => {
                return res.json();
            })
            .then((data) => {
                if(data.error) {
                    if(data.error === "User with this email already exists") setEmailErrorMessage(data.error);
                    else if(data.error === "User with this username already exists") setUserErrorMessage(data.error);
                    else setFetchError("Could not create an account. Please try again.");
                    setIsPending(false);
                    setIsButtonDisabled(false);
                }
                else if(data.token) {
                    setJwtToken(data.token);
                    //send confirmation email
                    fetch("http://localhost:8080/api/v1/auth/mail/token",
                        {
                            method: 'POST',
                            headers: {
                                "Origin": "http://localhost:8080:3000",
                                "Authorization": "Bearer " + data.token
                            }
                        })
                        .then((res) => {
                            if(!res.ok) throw Error("Could not send email");
                            setEmailNotificationMessage("We've sent a confirmation e-mail to " + emailInput + ". Please access the e-mail to complete the registration process.");
                            setIsPending(false);
                            setIsButtonDisabled(false);
                        })
                        .then()
                        .catch(e => {
                            console.log(e.message);
                            setEmailNotificationMessage("We've sent a confirmation e-mail to " + emailInput + ". Please access the e-mail to complete the registration process.");
                            setIsPending(false);
                            setIsButtonDisabled(false);
                        });

                    //start a timer that checks if the user is verified every 3 seconds
                    let checkVerifiedTimer = setInterval(() => {
                        fetch("http://localhost:8080/api/v1/user/verified",
                            {
                                method: 'GET',
                                headers: {
                                    "Origin": "http://localhost:8080:3000",
                                    "Authorization": "Bearer " + data.token
                                }
                            })
                            .then((res) => {
                                if(!res.ok) throw Error("User not found")
                                return res.text();
                            })
                            .then((userData) => {
                                console.log(userData);
                                const isVerified:boolean = JSON.parse(userData);
                                if(isVerified) {
                                    clearInterval(checkVerifiedTimer);
                                    Cookies.set('jwtToken', data.token);
                                    navigate("/");
                                }
                            })
                            .catch(e => console.log(e.message))
                    }, 3000)

                }
            })
            .catch(() => {
                setIsPending(false);
                setFetchError("Could not create an account. Please try again later.");
                setIsButtonDisabled(false);
            })
    }

    function changeEmail() {
        setIsNewEmailButtonDisabled(true);
        setIsPending(true);
        setNewEmailErrorMessage("");
        if(!emailRegex.test(newEmailInput)) {
            setNewEmailErrorMessage("Not a valid email!");
            setIsNewEmailButtonDisabled(false);
            setIsPending(false);
            return;
        }

        const countdownDuration = 60; // Countdown duration in seconds
        const endTime = Date.now() + countdownDuration * 1000; // Calculate end time

        setNewEmailButtonCountdown(countdownDuration); // Set initial countdown value

        const countdownInterval = setInterval(() => {
            const remainingTime = Math.ceil((endTime - Date.now()) / 1000); // Calculate remaining time

            if (remainingTime < 0) {
                // Countdown completed, enable the button and clear the interval
                setIsNewEmailButtonDisabled(false);
                clearInterval(countdownInterval);
            } else {
                // Update the countdown value
                setNewEmailButtonCountdown(remainingTime);
            }}, 1000); // Update every second

        //update the email in the database and send a confirmation mail to that address
        fetch("http://localhost:8080/api/v1/user/email/update/" + newEmailInput,
            {
                method: 'POST',
                headers: {
                    "Origin": "http://localhost:8080:3000",
                    "Authorization": "Bearer " + jwtToken
                }
            }
        )
            .then(res => {
                if(!res.ok) return res.json();
                else return "{}";
            })
            .then((data) => {
                if(data.error) {
                    clearInterval(countdownInterval);
                    setNewEmailButtonCountdown(0);
                    setIsNewEmailButtonDisabled(false);
                    if(data.error === "User with this email already exists") throw Error(data.error)
                    else throw Error("Could not send another email. Please try again.");
                }
            })
            .then(() => {
                setEmailNotificationMessage("Sending email...");
                fetch("http://localhost:8080/api/v1/auth/mail/token",
                    {
                        method: 'POST',
                        headers: {
                            "Origin": "http://localhost:8080:3000",
                            "Authorization": "Bearer " + jwtToken
                        }
                    })
                    .then((res) => {
                        if(!res.ok) throw Error("Could not send another email. Please try again");
                    })
                    .then(() => {
                        setEmailNotificationMessage("We've sent a confirmation e-mail to " + newEmailInput + ". Please access the e-mail to complete the registration process.");
                        setIsPending(false);
                        }
                    )
                    .catch(e => {
                        setIsPending(false);
                        setNewEmailErrorMessage(e.message)
                        clearInterval(countdownInterval);
                        setNewEmailButtonCountdown(0);
                        setIsNewEmailButtonDisabled(false);
                    })
            })
            .catch((e) => {
                setIsPending(false);
                setNewEmailErrorMessage(e.message);
                clearInterval(countdownInterval);
                setNewEmailButtonCountdown(0);
                setIsNewEmailButtonDisabled(false);
            })
    }

    return (
        <div className="background-div" id = "registration-page-background">
            <div id="registration-page-form-container">
                <Link to='/'>
                    <h1>
                        <span style={{color: 'black'}}>Tech</span>
                        <span style={{color: 'purple'}}>Hub</span>
                    </h1>
                </Link>
                {!emailNotificationMessage && <form id="registration-page-form" onSubmit={handleRegistrationSubmit}>
                        <div id="registration-form-name-div">
                            <div id="registration-form-firstname-div" style={{border: isFirstNameFocused ? '2px solid #730075' : '2px solid #AAAAAA'}}>
                                <span className="material-symbols-outlined" id="registration-firstname-icon" style={{"font-variation-settings":isFirstNameFocused ? "'FILL' 1" :""} as React.CSSProperties}>person</span>
                                <input
                                    id="registration-form-firstname"
                                    type="text"
                                    placeholder="Enter first name"
                                    onFocus={handleFirstNameFocus}
                                    onBlur={handleFirstNameBlur}
                                    onChange={(event) => setFirstNameInput(event.target.value)}
                                    value={firstNameInput}
                                />
                            </div>
                            <div id="registration-form-lastname-div" style={{border: isLastNameFocused ? '2px solid #730075' : '2px solid #AAAAAA'}}>
                                <span className="material-symbols-outlined" id="registration-lastname-icon" style={{"font-variation-settings":isLastNameFocused ? "'FILL' 1" :""} as React.CSSProperties}>person</span>
                                <input
                                    id="registration-form-lastname"
                                    type="text"
                                    placeholder="Enter last name"
                                    onFocus={handleLastNameFocus}
                                    onBlur={handleLastNameBlur}
                                    onChange={(event) => setLastNameInput(event.target.value)}
                                    value={lastNameInput}
                                />
                            </div>
                        </div>
                        {nameErrorMessage && <p className = "registration-page-error-p">{nameErrorMessage}</p>}
                        <div id="registration-form-username-div" style={{border: isUserFocused ? '2px solid #730075' : '2px solid #AAAAAA'}}>
                            <span className="material-symbols-outlined" id="registration-username-icon" style={{"font-variation-settings":isUserFocused ? "'FILL' 1" :""} as React.CSSProperties}>person_4</span>
                            <input
                                id="registration-form-username"
                                type="text"
                                placeholder="Enter username"
                                onFocus={handleUserFocus}
                                onBlur={handleUserBlur}
                                onChange={(event) => setUsernameInput(event.target.value)}
                                value={usernameInput}
                            />
                        </div>
                        {userErrorMessage && <p className = "registration-page-error-p">{userErrorMessage}</p>}
                        <div id="registration-form-email-div" style={{border: isEmailFocused ? '2px solid #730075' : '2px solid #AAAAAA'}}>
                            <span className="material-symbols-outlined" id="registration-email-icon" style={{"font-variation-settings":isEmailFocused ? "'FILL' 1" :""} as React.CSSProperties}>mail</span>
                            <input
                                id="registration-form-email"
                                type="text"
                                placeholder="Enter e-mail"
                                onFocus={handleEmailFocus}
                                onBlur={handleEmailBlur}
                                onChange={(event) => setEmailInput(event.target.value)}
                                value={emailInput}
                            />
                        </div>
                        {emailErrorMessage && <p className = "registration-page-error-p">{emailErrorMessage}</p>}
                        <div id="registration-form-password-div" style={{border: isPasswordFocused ? '2px solid #730075' : '2px solid #AAAAAA'}}>
                            <span className="material-symbols-outlined" id="registration-password-icon" style={{"font-variation-settings":isPasswordFocused ? "'FILL' 1" :""} as React.CSSProperties}>lock</span>
                            <input
                                id="registration-form-password"
                                type="password"
                                placeholder="Enter password"
                                onFocus={handlePasswordFocus}
                                onBlur={handlePasswordBlur}
                                onChange={(event) => setPasswordInput(event.target.value)}
                                value={passwordInput}
                            />
                        </div>
                        {passwordErrorMessage && <p className = "registration-page-error-p">{passwordErrorMessage}</p>}
                        <div id="registration-form-confirm-div" style={{border: isConfirmFocused ? '2px solid #730075' : '2px solid #AAAAAA'}}>
                            <span className="material-symbols-outlined" id="registration-confirm-icon" style={{"font-variation-settings":isConfirmFocused ? "'FILL' 1" :""} as React.CSSProperties}>lock</span>
                            <input
                                id="registration-form-confirm"
                                type="password"
                                placeholder="Confirm password"
                                onFocus={handleConfirmFocus}
                                onBlur={handleConfirmBlur}
                                onChange={(event) => setConfirmInput(event.target.value)}
                                value={confirmInput}
                            />
                        </div>
                        {confirmErrorMessage && <p className = "registration-page-error-p">{confirmErrorMessage}</p>}
                        <button className="cover-button" id="register-page-register-button" disabled={isButtonDisabled}>Register</button>
                        {fetchError && !isPending && <div id = "registration-page-fetch-error">{fetchError}</div>}
                    </form>}
                {isPending && !emailNotificationMessage &&
                    <div className="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>}
                {emailNotificationMessage && <div id="registration-page-email-notification-div">
                    <div>{emailNotificationMessage}</div><br/>
                    <div>Not the right email? Enter a new one below</div>
                    <div id="registration-page-email-notification-button-div">
                        <input type="text"
                               id="registration-page-new-email-input"
                               placeholder="Enter new e-mail"
                               onChange={(event) => setNewEmailInput(event.target.value)}
                               value={newEmailInput}
                        ></input>
                        <button id="registration-page-new-email-submit-button" className="cover-button" onClick={changeEmail} disabled={isNewEmailButtonDisabled}>{newEmailButtonCountdown > 0 ? newEmailButtonCountdown : "Submit"}</button>
                    </div>
                    {newEmailErrorMessage && <div id="registration-page-new-email-error-div">{newEmailErrorMessage}</div>}
                    {isPending &&
                        <div className="lds-roller">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>}
                </div>}
            </div>
        </div>
    )
}
export default RegistrationPage;