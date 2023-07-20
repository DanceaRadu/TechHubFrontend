import ShoppingCartEntry from "../models/ShoppingCartEntry";
// @ts-ignore
import Cookies from "js-cookie";

function addCookieShoppingCartEntries(jwtToken:string, setShoppingCartEntries:any): void {

    let fetchPromises = [];

    if(Cookies.get('shoppingCartProducts') != null) {
        let cookieStoredShoppingCartItems: ShoppingCartEntry[] = JSON.parse(Cookies.get('shoppingCartProducts'));

        for(let i = 0; i < cookieStoredShoppingCartItems.length; i++) {
            fetchPromises.push(
                fetch("http://localhost:8080/api/v1/user/shoppingcart/" + cookieStoredShoppingCartItems[i].product.productID, {
                    method: 'POST',
                    headers: {
                        "Origin": "http://localhost:8080:3000",
                        "Authorization": "Bearer " + jwtToken
                    }
                })
                    .then(res => {
                        if (!res.ok) throw Error("Couldn't add product to cart");
                    })
                    .catch(() => {
                        console.log("Error appending the cookie shopping cart");
                    })
                );
        }
        Cookies.set('shoppingCartProducts', JSON.stringify([]));
    }
    Promise.all(fetchPromises)
        .then(() => {
            fetch("http://localhost:8080/api/v1/user/shoppingcart",
                {
                    method: 'GET',
                    headers: {
                        "Origin": "http://localhost:8080:3000",
                        "Authorization": "Bearer " + jwtToken
                    }
                }
            )
                .then(res => {
                    if (!res.ok) throw Error("Could not fetch shopping cart products");
                    return res.json();
                })
                .then(data => {
                    setShoppingCartEntries(data);
                })
                .catch(err => {
                    console.log(err.message);
                })
        })
}

export default addCookieShoppingCartEntries;