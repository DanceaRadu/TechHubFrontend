import {useEffect, useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";
import ShoppingCartEntry from "../models/ShoppingCartEntry";

function useFetchShoppingCartProducts(isLoggedIn:boolean) {
    const [shoppingCartEntries, setShoppingCartEntries] = useState<ShoppingCartEntry[]>([]);
    const [error, setError] = useState<any>(null);
    const [isPending, setIsPending] = useState<boolean>(true);

    useEffect(() => {

        if(isLoggedIn) {
            fetch("http://localhost:8080/api/v1/user/shoppingcart",
                {
                    method: 'GET',
                    headers: {
                        "Origin": "http://localhost:8080:3000",
                        "Authorization": "Bearer " + Cookies.get('jwtToken')
                    }
                }
            )
                .then(res => {
                    if (!res.ok) throw Error("Could not fetch shopping cart products");
                    return res.json();
                })
                .then(data => {
                    setShoppingCartEntries(data);
                    setIsPending(false);
                    setError(null);
                })
                .catch(err => {
                    setIsPending(false);
                    setError(err.message);
                })
        }
        else {
            let entryList:ShoppingCartEntry[] = [];
            if(Cookies.get('shoppingCartProducts') == null) Cookies.set('shoppingCartProducts', JSON.stringify(entryList));

            entryList = JSON.parse(Cookies.get('shoppingCartProducts'));

            setShoppingCartEntries(entryList);
            setIsPending(false);
            setError(false);
        }
    }, [isLoggedIn])

    return {shoppingCartEntries, error, isPending, setShoppingCartEntries};
}

export default useFetchShoppingCartProducts;