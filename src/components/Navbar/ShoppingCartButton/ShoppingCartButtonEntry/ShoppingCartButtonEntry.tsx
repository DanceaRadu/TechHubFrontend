import ShoppingCartEntry from "../../../../models/ShoppingCartEntry";
import './ShoppingCartButtonEntry.css'
import useFetchImage from "../../../../hooks/useFetchImage";
import {useEffect, useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";

function ShoppingCartButtonEntry(props:any) {

    let product:ShoppingCartEntry = props.entry;
    const imageID = product?.product.productImages[0]?.image?.imageID;

    // Call useFetchImage unconditionally
    const { imageSourceUrl, error, isPending } = useFetchImage(imageID)
    const [itemTotal, setItemTotal] = useState<number>(0);
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

    useEffect(() => {
        setItemTotal(product.quantity * product.product.productPrice);
    }, [product.quantity])

    function handleEntryDelete() {
        setIsLoadingDelete(true);
        if(props.isLoggedIn) {
            fetch("http://localhost:8080/api/v1/user/shoppingcart/" + product.product.productID,
                {
                    method: 'DELETE',
                    headers: {
                        "Origin": "http://localhost:8080:3000",
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
            {!error && !isPending && <img id="shopping-cart-button-entry-image" src={imageSourceUrl} alt="asd"/>}
            {(isPending || error) ? (
                <img id="shopping-cart-button-entry-image" src={require('../../../../resources/images/whiteSquare.png')}  alt="asdasd"/>
            ) : null}
            <div id="shopping-cart-button-entry-product-name">{product.product.productName}</div>
            <div id="shopping-cart-button-entry-product-quantity">{"x" + product.quantity}</div>
            <div id="shopping-cart-button-entry-right-div">
                <div id="shopping-cart-button-entry-product-total">{itemTotal + "$"}</div>
                <button id="shopping-cart-button-entry-x-button" onClick={handleEntryDelete}>X</button>
            </div>
        </div>
    )
}

export default ShoppingCartButtonEntry;