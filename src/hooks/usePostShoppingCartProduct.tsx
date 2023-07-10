import {useEffect, useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";
import {UUID} from "crypto";

function usePostShoppingCartProduct(isLoggedIn:boolean, productID:UUID) {

    const [error, setError] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(true);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/user/shoppingcart/" + productID,
            {
                method: 'POST',
                headers: {
                    "Origin": "http://localhost:8080:3000",
                    "Authorization": "Bearer " + Cookies.get('jwtToken')
                }
            }
        )
            .then(res => {
                if (!res.ok) throw Error("Couldn't add product to cart");
                setError(false);
                setIsPending(false);
            })
            .catch(() => {
                setError(true);
                setIsPending(false);
            })
    }, [isLoggedIn, productID]);
    return {error, isPending};
}

export default usePostShoppingCartProduct;