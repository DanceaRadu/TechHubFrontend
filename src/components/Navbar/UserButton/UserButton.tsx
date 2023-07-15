import "./UserButton.css"
import useFetchProfilePicture from "../../../hooks/useFetchProfilePicture";
import {Link, useNavigate} from "react-router-dom";
// @ts-ignore
import Cookies from "js-cookie";
import {useEffect, useState} from "react";

function UserButton(props: any) {

    const {imageSourceUrl, error, isPending} = useFetchProfilePicture();
    let isLoggedIn:boolean = props.isLoggedIn;
    let isPendingLoggedIn:boolean = props.isPendingLoggedIn;

    const [loginLink, setLoginLink] = useState<string>("/login");
    useEffect(() => {
        if(props.isLoggedIn) setLoginLink("/user");
        else setLoginLink("/login");
    }, [props.isLoggedIn]);

    const navigate = useNavigate();

    function handleLogOut() {
        Cookies.remove("jwtToken");
        window.location.reload();
    }

    function handleLogIn() {
        navigate("/login");
    }

    return (
        <div id="user-button-container">
            <div id = "user-button">
                {(isPending || error) ? (
                    <Link to={loginLink}>
                        <span className="material-symbols-outlined" id="user-button-icon">account_circle</span>
                    </Link>
                ) : null}
                {!isPending && !error && <img src={imageSourceUrl} id="user-button-image"/>}
                <p id="user-button-text">Account</p>
            </div>
            {isLoggedIn && <div id="user-button-dropdown">
                <div className="user-button-dropdown-item">My account</div>
                <div className="user-button-dropdown-item">My orders</div>
                <div className="user-button-dropdown-item">Favorites</div>
                <div className="user-button-dropdown-item" onClick={handleLogOut}>Log out</div>
            </div>}
            {!isLoggedIn && !isPendingLoggedIn && <div id="user-button-dropdown">
                <div className="user-button-dropdown-item" onClick={handleLogIn}>Log in</div>
                <div className="user-button-dropdown-item" onClick={() => {navigate("/signup")}}>Sign up</div>
            </div>
            }
            {isPendingLoggedIn && <div id="user-button-dropdown">
                <div className="user-button-dropdown-item">Loading</div>
            </div>
            }
        </div>
    );
}

export default UserButton;