import ShoppingCartEntry from "../../../../models/ShoppingCartEntry";
import './ShoppingCartButtonEntry.css'
import useFetchImage from "../../../../hooks/useFetchImage";
import React, {useEffect, useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";
import config from "../../../../config";

function ShoppingCartButtonEntry(props:any) {

    let product:ShoppingCartEntry = props.entry;
    const imageID = product?.product.productImages[0]?.image?.imageID;

    // Call useFetchImage unconditionally
    const { imageSourceUrl, error, isPending } = useFetchImage(imageID)
    const [itemTotal, setItemTotal] = useState<number>(0);
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

    useEffect(() => {
        setItemTotal(product.quantity * product.product.productPrice);
    }, [product.quantity, product.product.productPrice])

    function handleEntryDelete() {
        setIsLoadingDelete(true);
        if(props.isLoggedIn) {
            fetch(config.apiUrl + "/user/shoppingcart/" + product.product.productID,
                {
                    method: 'DELETE',
                    headers: {
                        "Origin": config.origin,
                        "Authorization": "Bearer " + Cookies.get('jwtToken')
                    }
                }
            )
                .then(res => {
                    if (!res.ok) throw Error("Couldn't check logged in state");
                    let newEntries = [];
                    for (let i = 0; i < props.shoppingCartEntries.length; i++)
                        if (props.shoppingCartEntries[i].product.productID !== product.product.productID) newEntries.push(props.shoppingCartEntries[i])

                    props.setShoppingCartEntries(newEntries);
                    setIsLoadingDelete(false);
                })
                .catch(() => {
                    setIsLoadingDelete(false);
                    console.log("Failed to remove shopping cart entry");
                })
        }
        else {
            if(Cookies.get('shoppingCartProducts') == null) Cookies.set('shoppingCartProducts', JSON.stringify([]))
            const entryList:ShoppingCartEntry[] = JSON.parse(Cookies.get('shoppingCartProducts')) || [];
            let updatedList:ShoppingCartEntry[] = [];

            for(let i = 0; i < entryList.length; i++)
                if (entryList[i].product.productID !== product.product.productID) updatedList.push(entryList[i]);

            Cookies.set('shoppingCartProducts', JSON.stringify(updatedList));
            props.setShoppingCartEntries(updatedList);
            console.log(Cookies.get('shoppingCartProducts'));
            setIsLoadingDelete(false);
        }
    }

    return(
        <div id="shopping-cart-button-entry-container">
            {!error && !isPending && !isLoadingDelete && <img id="shopping-cart-button-entry-image" src={imageSourceUrl} alt="Product"/>}
            {((isPending || error) && !isLoadingDelete) ? (
                <img id="shopping-cart-button-entry-image" src={require('../../../../resources/images/whiteSquare.png')}  alt="Product"/>
            ) : null}
            {!isLoadingDelete && <div id="shopping-cart-button-entry-product-name">{product.product.productName}</div>}
            {!isLoadingDelete && <div id="shopping-cart-button-entry-product-quantity">{"x" + product.quantity}</div>}
            {!isLoadingDelete && <div id="shopping-cart-button-entry-right-div">
                <div id="shopping-cart-button-entry-product-total">{itemTotal + "$"}</div>
                <button id="shopping-cart-button-entry-x-button" onClick={handleEntryDelete}>X</button>
            </div>}
            {isLoadingDelete &&
                <div id="shopping-cart-button-entry-lds-roller-outer-div">
                    <div className="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
            </div> }
        </div>
    )
}

export default ShoppingCartButtonEntry;