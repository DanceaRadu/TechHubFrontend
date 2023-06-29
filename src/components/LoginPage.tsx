import React, {useState} from 'react'
import {Link} from "react-router-dom";

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

   const handleLoginSubmit = (e: any) => {
     e.preventDefault();
     console.log(usernameInput + passwordInput);
     fetch('http://localhost:8080/api/v1/auth/authenticate', {
         method: 'POST',
         headers: {
             "Content-Type": "application/json",
             "Origin":"http://localhost:8080:3000"
         },
         body: JSON.stringify({"username":usernameInput, "password":passwordInput})
     }).then(() => {
         console.log("loggedin");
     })
   };

    const [usernameInput, setUsernameInput] = useState<string>('');
    const [passwordInput, setPasswordInput] = useState<string>('');

    return (
        <div id='login-page-background'>
            <div className="login-page">
                <div>
                    <h1>Login</h1>
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
                        <div>
                            <div>
                                <label htmlFor="remember-me-checkbox" id="login-checkbox-label">Remember me</label>
                                <input type="checkbox" id="remember-me-checkbox" className="checkbox"/>
                            </div>
                        </div>
                        <button>Login</button>
                    </form>
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