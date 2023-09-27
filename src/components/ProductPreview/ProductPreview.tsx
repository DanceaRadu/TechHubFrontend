import './ProductPreview.css'
import Product from "../../models/Product";
import React, {useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";
import ShoppingCartEntry from "../../models/ShoppingCartEntry";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import useFetchImage from "../../hooks/useFetchImage";

function ProductPreview(props: any) {

    let product:Product = props.product;
    let shoppingCartEntries = props.shoppingCartEntries;
    let setShoppingCartEntries = props.setShoppingCartEntries;
    const [error, setError] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const imageID = product?.productImages[0]?.image?.imageID;
    const { imageSourceUrl, error: imageFetchError, isPending: isPendingImage } = useFetchImage(imageID)

    function handleAddToCart() {

        setIsButtonDisabled(true);
        if(props.isLoggedIn) {
            fetch("http://localhost:8080/api/v1/user/shoppingcart/" + product.productID, {
                method: 'POST',
                headers: {
                    "Origin": "http://localhost:8080:3000",
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
                    setError(false);
                    setIsPending(false);
                })
                .catch(() => {
                    setError(true);
                    setIsPending(false);
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
                if (entryList[i].product.productID !== product.productID) updatedList.push(entryList[i]);
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
            setIsPending(false);
            setError(false);
        }
        setIsButtonDisabled(false);
    }

    return (
        <div id = "product-preview-container">
            {!imageFetchError && !isPendingImage && <img id="product-preview-image" src={imageSourceUrl} alt="Product"/>}
            {isPendingImage || imageFetchError ? (
                <img id="product-preview-image" src={require('../../resources/images/product-placeholder.jpg')}  alt="Product"/>
            ) : null}
            <p id="product-preview-name">{product.productName}</p>
            <div id="product-preview-price-div">
                <p id="product-preview-price">{product.productPrice + " USD"}</p>
            </div>
            <button className="cover-button" id="product-preview-cart-button" onClick={handleAddToCart} disabled={isButtonDisabled}>Add to cart</button>
        </div>
    )
}

export default ProductPreview;