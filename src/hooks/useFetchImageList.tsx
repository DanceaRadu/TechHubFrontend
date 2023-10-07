import {useEffect, useState} from "react";
import config from "../config";
import ProductImage from "../models/ProductImage";

function useFetchImage(productImages:any) {

    const [imageSourceUrls, setImageSourceUrls] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(true);

    let array:string[] = [];

    useEffect(() => {
        const fetchImages = async () => {

            // Create an array of Promises for each fetch request
            const fetchPromises = productImages.map((image:ProductImage) =>
                    fetch(config.apiUrl + "/image/" + image.image.imageID, {
                        method: 'GET',
                        headers: { "Origin": config.origin }
                    })
                        .then(res => {
                            if (!res.ok) throw Error("Could not fetch image");
                            return res.blob();
                        })
                        .then((blob) => {
                            array.push(URL.createObjectURL(blob));
                        })
                        .catch(err => {
                            setError(err.message);
                        })
                );
                // Wait for all fetch requests to complete
                await Promise.all(fetchPromises).then(() => {
                    setImageSourceUrls(array);
                    setIsPending(false);
                });
        };
        fetchImages().catch((e) => {
            setError(e.message);
        })

    }, [productImages])
    return {imageSourceUrls, error, isPending};
}

export default useFetchImage;