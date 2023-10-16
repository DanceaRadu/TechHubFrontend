import {useEffect, useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";
import config from "../config";

function useFetchProfilePicture() {

    const [imageSourceUrl, setImageSourceUrl] = useState<string>("");
    const [error, setError] = useState<any>(null);
    const [isPending, setIsPending] = useState<boolean>(true);

    useEffect(() => {
        fetch(config.apiUrl + "/user/profilepicture",
            {method: 'GET',
                headers: {"Origin":config.origin,
                    "Authorization": "Bearer " + Cookies.get('jwtToken')}}
        )
            .then(res => {
                if(!res.ok) throw Error("Could not fetch image");
                return res.blob();
            })
            .then(blob => {
                setImageSourceUrl(URL.createObjectURL(blob));
                setIsPending(false);
                setError(null);
            })
            .catch(err => {
                setIsPending(false);
                setError(err.message);
            })
    }, [])
    return {imageSourceUrl, error, isPending};
}
export default useFetchProfilePicture;