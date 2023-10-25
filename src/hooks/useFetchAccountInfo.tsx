import {useEffect, useState} from "react";
import User from "../models/User";
import Image from "../models/Image"
// @ts-ignore
import Cookies from "js-cookie";
import config from "../config";

function useFetchAccountInfo(isLoggedIn:boolean) {

    const [accountInfo, setAccountInfo] = useState<User>(new User("", "", "", "", "USER", new Image("00000000-0000-0000-0000-000000000000", "", ""), ""));

    useEffect(() => {

        if(isLoggedIn) {
            fetch(config.apiUrl + "/user",
                {
                    method: 'GET',
                    headers: {
                        "Origin": config.origin,
                        "Authorization": "Bearer " + Cookies.get('jwtToken')
                    }
                }
            )
                .then(res => {
                    if (!res.ok) throw Error("Could not fetch user info");
                    return res.json();
                })
                .then(data => {
                    setAccountInfo(data);
                })
                .catch(() => {
                })
        }

    }, [isLoggedIn])

    return {accountInfo, setAccountInfo}
}

export default useFetchAccountInfo;