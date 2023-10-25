import {useEffect, useState} from "react";
import config from "../config";
// @ts-ignore
import Cookies from "js-cookie";

function useFetchUserReviews() {

    const [reviews, setReviews] = useState<any>([]);
    const [error, setError] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(true);

    useEffect(() => {

        fetch(config.apiUrl + "/user/reviews",
            {
                method: 'GET',
                headers: {
                    "Origin": config.origin,
                    "Authorization": "Bearer " + Cookies.get('jwtToken')
                }
            }
        )
            .then(res => {
                if (!res.ok) throw Error("Could not fetch user reviews");
                return res.json();
            })
            .then(data => {
                setReviews(data);
                setIsPending(false);
            })
            .catch((e) => {
                setError(e.message);
                setIsPending(false);
            })
    }, [])

    return {reviews, error, isPending};
}
export default useFetchUserReviews;