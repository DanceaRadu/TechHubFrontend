import './EmailTokenPage.css'
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

function EmailTokenPage(){

    const navigate = useNavigate();
    const {token} = useParams();
    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setError(false);
        fetch("http://localhost:8080/api/v1/auth/mail/verify/" + token,
            {method: 'GET',
                headers: {"Origin":"http://localhost:8080:3000",
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
    }, [token]);

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
        </div>
    );
}

export default EmailTokenPage;