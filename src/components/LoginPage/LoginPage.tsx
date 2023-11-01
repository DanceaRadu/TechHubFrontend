import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import './LoginPage.css'
// @ts-ignore
import Cookies from 'js-cookie'
import ShoppingCartEntry from "../../models/ShoppingCartEntry";
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import config from "../../config";
import CustomGoogleButton from "../CustomGoogleButton/CustomGoogleButton";
import {useGoogleLogin} from "@react-oauth/google";

function LoginPage(props:any) {

    const navigate = useNavigate();

    //if the user is already logged in, redirect them to their user page
    const {isLoggedIn, isPending: isPendingLoggedIn} = useCheckLoggedIn();
    useEffect(() => {
        if(isLoggedIn) navigate("/");
    }, [isLoggedIn, navigate])
    
    const [isUserFocused, setUserFocused] = useState<boolean>(false);
    const [isPasswordFocused, setPasswordFocused] = useState<boolean>(false);

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

    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState(null);

    const [usernameInput, setUsernameInput] = useState<string>(Cookies.get("username"));
    const [passwordInput, setPasswordInput] = useState<string>('');

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [isGoogleButtonDisabled, setIsGoogleButtonDisabled] = useState<boolean>(false);

    const handleCheckboxChange = (event: any) => {
        setIsChecked(event.target.checked);
    };

   const handleLoginSubmit = (e: any) => {
     e.preventDefault();
     Cookies.remove("username");
     if(usernameInput === '' || passwordInput === '') return;

     setIsButtonDisabled(true);
     setIsPending(true);
     setError(null);

     fetch(config.apiUrl + '/auth/authenticate', {
         method: 'POST',
         headers: {
             "Content-Type": "application/json",
             "Origin":config.origin
         },
         body: JSON.stringify({"username":usernameInput, "password":passwordInput})
     }).then(res => {
         if(!res.ok) throw Error('Could not complete the login process')
         setIsPending(false);
         setError(null);
         setIsButtonDisabled(false);
         return res.json();
     }).then(json => {
            Cookies.set('jwtToken', json.token, { expires: 30});
            if(isChecked) Cookies.set("username", usernameInput);
            setIsButtonDisabled(false);

            //if the login process is successful then we get the stored shopping cart items and add it the shopping cart entries in the database
            let fetchPromises = [];

            if(Cookies.get('shoppingCartProducts') != null) {
                let cookieStoredShoppingCartItems: ShoppingCartEntry[] = JSON.parse(Cookies.get('shoppingCartProducts'));

                for(let i = 0; i < cookieStoredShoppingCartItems.length; i++) {
                    fetchPromises.push(
                        fetch(config.apiUrl + "/user/shoppingcart/" + cookieStoredShoppingCartItems[i].product.productID, {
                            method: 'POST',
                            headers: {
                                "Origin": config.origin,
                                "Authorization": "Bearer " + Cookies.get('jwtToken')
                            }
                        })
                            .then(res => {
                                if (!res.ok) throw Error("Couldn't add product to cart");
                            })
                            .catch(() => {
                                console.log("Error appending the cookie shopping cart");
                            })
                    );
                }
                Cookies.set('shoppingCartProducts', JSON.stringify([]));
            }
            Promise.all(fetchPromises)
                .then(() => {
                    fetch(config.apiUrl + "/user/shoppingcart",
                        {
                            method: 'GET',
                            headers: {
                                "Origin": config.origin,
                                "Authorization": "Bearer " + Cookies.get('jwtToken')
                            }
                        }
                    )
                        .then(res => {
                            if (!res.ok) throw Error("Could not fetch shopping cart products");
                            return res.json();
                        })
                        .then(data => {
                            props.setShoppingCartEntries(data);
                        })
                        .catch(err => {
                            console.log(err.message);
                        })
                })
         })
         .then(() => navigate('/'))
         .catch(err => {
            setIsButtonDisabled(false);
            setIsPending(false);
            setError(err.message);
            setPasswordInput('');
        });
   };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: tokenResponse => {
            setIsPending(true);
            setError(null);
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
                    fetch(config.apiUrl + "/auth/authenticate/google",
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
                                if(data.error === "User was not found") { // @ts-ignore
                                    setError("The user associated to this Google account hasn't registered yet");
                                }
                                else { // @ts-ignore
                                    setError("Could not create an account. Please try again.");
                                }
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
                            // @ts-ignore
                            setError("Something went wrong");
                        })
                })
                .catch(() => {
                    setIsPending(false);
                    setIsGoogleButtonDisabled(false);
                    setIsButtonDisabled(false);
                    // @ts-ignore
                    setError("Something went wrong");
                });
        }
    });

    return (
        <div className="background-div">
            <div className="login-page">
                <div>
                    <Link to='/'>
                        <h1>
                            <span style={{color: 'black'}}>Tech</span>
                            <span style={{color: 'purple'}}>Hub</span>
                        </h1>
                    </Link>
                    <form id = "login-form" onSubmit={handleLoginSubmit}>
                        <div id="login-username-div" style={{border: isUserFocused ? '2px solid #730075' : '2px solid #AAAAAA'}}>
                            <span className="material-symbols-outlined" id="login-user-icon" style={{"font-variation-settings":isUserFocused ? "'FILL' 1" :""} as React.CSSProperties}>person</span>
                            <input
                                id="login-username"
                                type="text"
                                placeholder="Enter username"
                                onFocus={handleUserFocus}
                                onBlur={handleUserBlur}
                                onChange={(event) => setUsernameInput(event.target.value)}
                                value={usernameInput}
                            />
                        </div>
                        <div id="login-password-div" style={{border: isPasswordFocused ? '2px solid #730075' : '2px solid #AAAAAA'}}>
                            <span className="material-symbols-outlined" id="login-password-icon" style={{"font-variation-settings":isPasswordFocused ? "'FILL' 1" :""} as React.CSSProperties}>lock</span>
                            <input
                                id="login-password"
                                type="password"
                                placeholder="Enter password"
                                onFocus={handlePasswordFocus}
                                onBlur={handlePasswordBlur}
                                onChange={(event) => setPasswordInput(event.target.value)}
                                value={passwordInput}
                            />
                        </div>
                        {error && <div className='login-error-div'>! Wrong account information</div>}
                        <div>
                            <div>
                                <label htmlFor="remember-me-checkbox" id="login-checkbox-label">Remember me</label>
                                <input
                                    type="checkbox"
                                    id="remember-me-checkbox"
                                    className="purple-checkbox"
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                        </div>
                        <button className="cover-button" disabled={isButtonDisabled}>Login</button>
                        <hr style={{width:"100%", marginTop:15, marginBottom:15}}/>
                        <CustomGoogleButton onClick={handleGoogleLogin} text={"Log in with Google"} disabled={isGoogleButtonDisabled}></CustomGoogleButton>
                    </form>
                    {isPending &&
                        <div id="lds-roller-outer-div">
                            <div className="lds-roller">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>}
                    <div id="no-account-div">
                        <Link to="/home">Forgot password?</Link><br/>
                        <Link to="/signup">Don't have an account? Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;