import './RegistrationPage.css'
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import RegisterRequest from "../../models/RegisterRequest";
// @ts-ignore
import Cookies from "js-cookie";
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import addCookieShoppingCartEntries from "../../functions/addCookieShoppingCartEntries";
import config from "../../config";
import {useGoogleLogin} from "@react-oauth/google";
import CustomGoogleButton from "../CustomGoogleButton/CustomGoogleButton";

function RegistrationPage(props: any) {

    const navigate = useNavigate();
    const {isLoggedIn, isPending: isPendingLoggedIn} = useCheckLoggedIn();

    //if the user is already logged in, redirect them to their user page
    useEffect(() => {
        if(isLoggedIn) navigate("/");
    }, [isLoggedIn, navigate])

    //states and functions for changing the style of the input divs whenever the input field become focused or blurred
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

    //states and functions for setting the error messages for each input field
    const [nameErrorMessage, setNameErrorMessage] = useState<string>("");
    const [userErrorMessage, setUserErrorMessage] = useState<string>("");
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
    const [confirmErrorMessage, setConfirmErrorMessage] = useState<string>("");
    const [newEmailErrorMessage, setNewEmailErrorMessage] = useState<string>("");

    //states and functions for getting and changing the user input, including the new email input
    const [firstNameInput, setFirstNameInput] = useState<string>('');
    const [lastNameInput, setLastNameInput] = useState<string>('');
    const [usernameInput, setUsernameInput] = useState<string>('');
    const [emailInput, setEmailInput] = useState<string>('');
    const [passwordInput, setPasswordInput] = useState<string>('');
    const [confirmInput, setConfirmInput] = useState<string>('');
    const [newEmailInput, setNewEmailInput] = useState<string>('');

    //state for notifying the user that the email is being sent
    const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

    //for disabling buttons when the user clicks them
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const [isNewEmailButtonDisabled, setIsNewEmailButtonDisabled] = useState<boolean>(false);
    const [isGoogleButtonDisabled, setIsGoogleButtonDisabled] = useState<boolean>(false);

    //countdown for disabling the new email button for a number of seconds
    const [newEmailButtonCountdown, setNewEmailButtonCountdown] = useState<number>(0);

    //for displaying loading animation and fetch errors
    const [fetchError, setFetchError] = useState<string>('');
    const [isPending, setIsPending] = useState<boolean>(false);
    const [emailNotificationMessage, setEmailNotificationMessage] = useState<string>('');

    //regex for checking the validity of the password and for the email.
    //the email must be valid, and the password must be between 8 and 64 chars, contain at least 1 number, 1 letter and 1 uppercase character
    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/);
    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,64}$/);

    //jwt token state for updating and remembering the jwt token returned by the register fetch
    const [jwtToken, setJwtToken] = useState<string>('');

    /*function that handles the registration process. The function checks the validity of the user inputs locally,
    and then it checks that the user doesn't already exist in the database by sending a request to the backend.
    Then, it stores the user in the database and sends a request to the backend to send a verification email to the user*/
    function handleRegistrationSubmit(e:any) {
        e.preventDefault(); //prevent page reload
        setIsPending(true); //set is pending to true, which causes the loading animation to be displayed
        setIsButtonDisabled(true); //disable the registration button

        //reset the error messages
        setNameErrorMessage('');
        setUserErrorMessage('');
        setEmailErrorMessage('');
        setPasswordErrorMessage('');
        setConfirmErrorMessage('');

        let ok:boolean = true;

        //check that the name fields are not empty
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

        //reset the fetch error and send a request to the server to register the user
        setFetchError('');
        fetch(config.apiUrl + "/auth/register",
            {
                method: 'POST',
                headers: {
                    "Origin": config.origin,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(new RegisterRequest(usernameInput, emailInput, passwordInput, firstNameInput, lastNameInput))
            }
        )
            .then(res => {
                return res.json();
            })
            .then((data) => {
                //if the returned data contains the error param, that means there was an error with the registration process
                if(data.error) {
                    if(data.error === "User with this email already exists") setEmailErrorMessage(data.error);
                    else if(data.error === "User with this username already exists") setUserErrorMessage(data.error);
                    else setFetchError("Could not create an account. Please try again.");
                    setIsPending(false);
                    setIsButtonDisabled(false);
                }
                else if(data.token) {
                    //if the fetch response contains a jwt token, that means the registration was successful, and we can store the token in the browser cookies
                    setJwtToken(data.token);

                    //if there are any shopping cart products stored locally in cookies, fetch them and add them to the user's account. After this, delete the products from the cookies.
                    addCookieShoppingCartEntries(data.token, props.setShoppingCartEntries);

                    //send confirmation email. This endpoint will email the user a link that they must click in order to validate their email
                    setIsSendingEmail(true);
                    fetch("http://localhost:8080/api/v1/auth/mail/token",
                        {
                            method: 'POST',
                            headers: {
                                "Origin": "http://localhost:8080:3000",
                                "Authorization": "Bearer " + data.token
                            }
                        })
                        .then((res) => {
                            //even if there was a problem sending the email, the website will load the message telling the user that the email has been sent.
                            //if there truly was a problem delivering the email, the user can then resend the email in the next step
                            setEmailNotificationMessage("We've sent a confirmation e-mail to " + emailInput + ". Please access the e-mail to complete the registration process.");
                            setIsPending(false);
                            setIsButtonDisabled(false);
                            setIsSendingEmail(false);
                            if(!res.ok) throw Error("Could not send email");
                        })
                        .catch(e => {
                            console.log(e.message);
                        });

                    //start a timer that checks if the user is verified every 3 seconds. If the user has verified their email, we then redirect to the main page.
                    let checkVerifiedTimer = setInterval(() => {
                        fetch(config.apiUrl + "/user/verified",
                            {
                                method: 'GET',
                                headers: {
                                    "Origin": config.origin,
                                    "Authorization": "Bearer " + data.token
                                }
                            })
                            .then((res) => {
                                if(!res.ok) throw Error("User not found")
                                return res.text();
                            })
                            .then((userData) => {
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

    /*function that allows the user to change their email, in case they typed the wrong one during the previous step.
    The function makes sure that the new email doesn't already exist in the database, and then in sends a verification email to the new user email*/
    function changeEmail() {
        setIsNewEmailButtonDisabled(true); //disable the change email button
        setIsPending(true);
        setNewEmailErrorMessage("");

        //test the new email to make sure it has a valid format
        if(!emailRegex.test(newEmailInput)) {
            setNewEmailErrorMessage("Not a valid email!");
            setIsNewEmailButtonDisabled(false);
            setIsPending(false);
            return;
        }

        //countdown for disabling the 'change email button'. The button has a 60-second timeout to make sure the user doesn't spam it.
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
        //the method here should normally be PATCH, but CORS in Spring disables the PATCH method, and enabling it doesn't seem to work
        fetch(config.apiUrl + "/user/email/update/" + newEmailInput,
            {
                method: 'POST',
                headers: {
                    "Origin": config.origin,
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
                fetch(config.apiUrl + "/auth/mail/token",
                    {
                        method: 'POST',
                        headers: {
                            "Origin": config.origin,
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

    const handleGoogleSignup = useGoogleLogin({
        onSuccess: tokenResponse => {
            setIsPending(true);
            setFetchError("");
            setIsButtonDisabled(true);
            setIsGoogleButtonDisabled(true);
            const url = 'https://www.googleapis.com/oauth2/v2/userinfo';
            fetch(url, {
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`
                }
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to fetch user info');
                    }
                })
                .then((userInfo) => {
                    console.log(userInfo)
                    fetch(config.apiUrl + "/auth/register/google",
                        {
                            method: 'POST',
                            headers: {
                                "Origin": config.origin,
                                'Content-Type': 'application/json'
                            },
                            body: userInfo.family_name === undefined ? JSON.stringify({...userInfo, family_name: userInfo.given_name}) : JSON.stringify(userInfo)
                        }
                    )
                        .then(res => {
                            return res.json();
                        })
                        .then((data) => {
                            //if the returned data contains the error param, that means there was an error with the registration process
                            if(data.error) {
                                if(data.error === "User with this email already exists") setFetchError(data.error);
                                else if(data.error === "This google account is already associated to a user") setFetchError(data.error);
                                else setFetchError("Could not create an account. Please try again.");
                                setIsPending(false);
                                setIsButtonDisabled(false);
                                setIsGoogleButtonDisabled(false);
                            }
                            else if(data.token) {
                                //if the fetch response contains a jwt token, that means the registration was successful, and we can store the token in the browser cookies
                                Cookies.set('jwtToken', data.token);
                                navigate("/");
                            }}
                        )
                        .catch(() => {
                            setIsPending(false);
                            setIsGoogleButtonDisabled(false);
                            setIsButtonDisabled(false);
                            setFetchError("Something went wrong");
                        })
                })
                .catch(() => {
                    setIsPending(false);
                    setIsGoogleButtonDisabled(false);
                    setIsButtonDisabled(false);
                    setFetchError("Something went wrong");
                });
        }
    });

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
                        <hr style={{width:"90%", marginTop:15, marginBottom:15}}/>
                        <CustomGoogleButton onClick={() => {handleGoogleSignup()}} text={"Sign-up with google"}></CustomGoogleButton>
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
                {isPending && isSendingEmail && <div id = "registration-page-sending-email-div">Sending verification email...</div>}
                {!emailNotificationMessage &&
                    <Link to="/login" id="registration-page-existing-account-link">
                        <div>Already have an account? Log in.</div>
                    </Link>}
                {emailNotificationMessage && <div id="registration-page-email-notification-div">
                    <div>{emailNotificationMessage}</div><br/>
                    <div>Not the right e-mail? Enter a new one below</div>
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