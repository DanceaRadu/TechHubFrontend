import {useEffect, useState} from "react";
import {UUID} from "crypto";

function useFetchImage(id:UUID) {

    const [imageSourceUrl, setImageSourceUrl] = useState<string>("");
    const [error, setError] = useState<any>(null);
    const [isPending, setIsPending] = useState<boolean>(true);

        useEffect(() => {
            if(id != null) {
                fetch("http://localhost:8080/api/v1/image/" + id,
                    {
                        method: 'GET',
                        headers: {"Origin": "http://localhost:8080:3000"}
                    }
                )
                    .then(res => {
                        if (!res.ok) throw Error("Could not fetch image");
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
            }
        }, [id])
    return {imageSourceUrl, error, isPending};
}

export default useFetchImage;