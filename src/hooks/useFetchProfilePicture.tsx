import {useEffect, useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";

function useFetchProfilePicture() {

    const [imageSourceUrl, setImageSourceUrl] = useState<string>("");
    const [error, setError] = useState<any>(null);
    const [isPending, setIsPending] = useState<boolean>(true);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/user/profilepicture",
            {method: 'GET',
                headers: {"Origin":"http://localhost:8080:3000",
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