import ShoppingCartEntry from "../models/ShoppingCartEntry";
import {v4 as uuidv4} from "uuid";
import {UUID} from "crypto";
// @ts-ignore
import Cookies from "js-cookie";
import shoppingCartEntry from "../models/ShoppingCartEntry";
import config from "../config";

function addProductToCart(isLoggedIn:boolean, productID:UUID, shoppingCartEntries:shoppingCartEntry[], setShoppingCartEntries:any):boolean {
    if(isLoggedIn) {
        fetch(config.apiUrl + "/user/shoppingcart/" + productID, {
            method: 'POST',
            headers: {
                "Origin": config.origin,
                "Authorization": "Bearer " + Cookies.get('jwtToken')
            }
        })
            .then(res => {
                if (!res.ok) throw Error("Couldn't add product to cart");
                return res.json();
            })
            .then(data => {
                const newEntry: ShoppingCartEntry = data;
                let newList: ShoppingCartEntry[] = [];
                let ok: boolean = false;
                for (let i = 0; i < shoppingCartEntries.length; i++) {
                    if (newEntry.shoppingCartEntryID !== shoppingCartEntries[i].shoppingCartEntryID) newList.push(shoppingCartEntries[i]);
                    else {
                        newList.push(data);
                        ok = true;
                    }
                }
                if (!ok) newList.push(data);
                setShoppingCartEntries(newList);
                return true;
            })
            .catch(() => {
                return false;
            });
    }
    else {
        if(Cookies.get('shoppingCartProducts') == null) Cookies.set('shoppingCartProducts', JSON.stringify([]))
        const entryList:ShoppingCartEntry[] = JSON.parse(Cookies.get('shoppingCartProducts')) || [];
        let ok:boolean = false;
        let updatedList:ShoppingCartEntry[] = [];
        // @ts-ignore
        const newEntry:ShoppingCartEntry = new ShoppingCartEntry(uuidv4(), product, 1);

        for(let i = 0; i < entryList.length; i++) {
            if (entryList[i].product.productID !== productID) updatedList.push(entryList[i]);
            else {
                newEntry.quantity = entryList[i].quantity + 1;
                updatedList.push(newEntry);
                ok = true;
            }
        }

        if(!ok) updatedList.push(newEntry);

        Cookies.set('shoppingCartProducts', JSON.stringify(updatedList));
        setShoppingCartEntries(updatedList);
        console.log(Cookies.get('shoppingCartProducts'));
        return true;
    }
    return false;
}

export default addProductToCart;