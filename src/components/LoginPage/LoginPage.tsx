import React, {useState} from 'react'
import {Link} from "react-router-dom";
import './LoginPage.css'

type AuthenticationRequest = {
    username:string;
    password:string;
}

function LoginPage() {

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

    const [usernameInput, setUsernameInput] = useState<string>('');
    const [passwordInput, setPasswordInput] = useState<string>('');

   const handleLoginSubmit = (e: any) => {
     e.preventDefault();
     setIsPending(true);
     setError(null);
     fetch('http://localhost:8080/api/v1/auth/authenticate', {
         method: 'POST',
         headers: {
             "Content-Type": "application/json",
             "Origin":"http://localhost:8080:3000"
         },
         body: JSON.stringify({"username":usernameInput, "password":passwordInput})
     }).then(res => {
         if(!res.ok) throw Error('Could not complete the login process')
         setIsPending(false);
         setError(null);
         //redirect
     }).catch(err => {
        setIsPending(false);
        setError(err.message);
        setPasswordInput('');
     })
   };

    return (
        <div id='login-page-background'>
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
                            />
                        </div>
                        {error && <div className='login-error-div'>! Wrong username or password</div>}
                        <div>
                            <div>
                                <label htmlFor="remember-me-checkbox" id="login-checkbox-label">Remember me</label>
                                <input type="checkbox" id="remember-me-checkbox" className="purple-checkbox"/>
                            </div>
                        </div>
                        <button className="cover-button">Login</button>
                    </form>
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