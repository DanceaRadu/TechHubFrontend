import './EmailTokenPage.css'
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import config from "../../config";

function EmailTokenPage(){

    const navigate = useNavigate();
    const {token} = useParams();
    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setError(false);
        fetch(config.apiUrl + "/auth/mail/verify/" + token,
            {method: 'GET',
                headers: {"Origin":config.origin,
                    }}
        )
            .then(res => {
                if(!res.ok) throw Error("Couldn't verify email");
                setIsPending(false);
                navigate("/");
            })
            .catch(() => {
                setIsPending(false);
                setError(true);
            })
    }, [token, navigate]);

    return(
        <div className="background-div" id="email-token-page-container">
            {isPending && <p>Pending verification...</p>}
            {isPending && <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div> }
            {error && <p>Error verifying email</p>}
            {!error && !isPending && <div id="email-token-page-verification-complete-div">Email verification complete. You may return to the registration page.</div>}
        </div>
    );
}

export default EmailTokenPage;