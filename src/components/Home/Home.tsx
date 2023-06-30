import React, {useEffect, useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";
import {Link} from "react-router-dom";

function Home() {

    const [jwt, setJWT] = useState<string>('');

    useEffect(() => {
        setJWT(Cookies.get('jwtToken'));
    }, []);

    function deleteToken() {
        Cookies.remove("jwtToken");
        setJWT('');
    }

    return(
        <div className="home-page">
            <h1>{jwt || 'no token'}</h1>
            <Link to="/login">Login</Link>
            <button onClick={deleteToken}>Delete token</button>
        </div>
    );
}

export default Home;