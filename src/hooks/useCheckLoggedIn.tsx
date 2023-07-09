import {useEffect, useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";

function useCheckLoggedIn() {

    const [isPending, setIsPending] = useState<boolean>(true);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/auth/validate",
            {method: 'POST',
                headers: {"Origin":"http://localhost:8080:3000",
                    "Authorization": "Bearer " + Cookies.get('jwtToken')}}
        )
            .then(res => {
                if(!res.ok) throw Error("Couldn't check logged in state");
                setIsLoggedIn(true);
                setIsPending(false);
            })
            .catch(() => {
                setIsPending(false);
                setIsLoggedIn(false);
            })
    }, [])
    return {isLoggedIn, isPending};

}
export default useCheckLoggedIn;