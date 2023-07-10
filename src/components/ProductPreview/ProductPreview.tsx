import './ProductPreview.css'
import Product from "../../models/Product";
import {useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";
import ShoppingCartEntry from "../../models/ShoppingCartEntry";

function ProductPreview(props: any) {

    let product:Product = props.product;
    let shoppingCartEntries = props.shoppingCartEntries;
    let setShoppingCartEntries = props.setShoppingCartEntries;
    const [error, setError] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(true);

    function handleAddToCart() {
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
                const newEntry:ShoppingCartEntry = data;
                let newList:ShoppingCartEntry[] = [];
                let ok:boolean = false;
                for(let i = 0; i < shoppingCartEntries.length; i++) {
                    if(newEntry.shoppingCartEntryID !== shoppingCartEntries[i].shoppingCartEntryID) newList.push(shoppingCartEntries[i]);
                    else {
                        newList.push(data);
                        ok = true;
                    }
                }
                if(!ok) newList.push(data);
                setShoppingCartEntries(newList);
                setError(false);
                setIsPending(false);
            })
            .catch(() => {
                setError(true);
                setIsPending(false);
            });
        }

    return (
        <div id = "product-preview-container">
            <img src={require("./login-background.jpg")} id="product-preview-image"></img>
            <p id="product-preview-name">{product.productName}</p>
            <button className="cover-button" id="product-preview-cart-button" onClick={handleAddToCart}>Add to cart</button>
        </div>
    )
}

export default ProductPreview;