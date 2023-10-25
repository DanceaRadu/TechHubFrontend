import {useEffect, useState} from "react";
import config from "../config";
// @ts-ignore
import Cookies from "js-cookie";

function useFetchUserFavorites(isLoggedIn:boolean) {
    const [favorites, setFavorites] = useState<any>([]);
    const [error, setError] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(true);

    useEffect(() => {

        setIsPending(true);
        if(isLoggedIn) {
            fetch(config.apiUrl + "/user/favorites",
                {
                    method: 'GET',
                    headers: {
                        "Origin": config.origin,
                        "Authorization": "Bearer " + Cookies.get('jwtToken')
                    }
                }
            )
                .then(res => {
                    if (!res.ok) throw Error("Could not fetch user favorites");
                    return res.json();
                })
                .then(data => {
                    setFavorites(data);
                    setIsPending(false);
                })
                .catch((e) => {
                    setError(e.message);
                    setIsPending(false);
                })
        }
        else setIsPending(false);
    }, [isLoggedIn])

    return {favorites, setFavorites, error, isPending};
}
export default useFetchUserFavorites;