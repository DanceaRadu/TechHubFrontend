import React, {useEffect, useState} from "react";
import './ShoppingCartButton.css'
import ShoppingCartButtonEntry from "./ShoppingCartButtonEntry/ShoppingCartButtonEntry";
import ShoppingCartEntry from "../../../models/ShoppingCartEntry";

function ShoppingCartButton(props:any) {

    const [shoppingCartNumberOfItems, setShoppingCartNumberOfItems] = useState<number>(0);
    const [shoppingCartTotal, setShoppingCartTotal] = useState<number>(0);

    useEffect(() => {
        if(props.shoppingCartEntries !== undefined) {
            let sum: number = 0;
            let product: number = 0;
            for (let i = 0; i < props.shoppingCartEntries.length; i++) {
                sum = sum + props.shoppingCartEntries[i].quantity;
                product = product + props.shoppingCartEntries[i].quantity * props.shoppingCartEntries[i].product.productPrice;
            }
            setShoppingCartNumberOfItems(sum);
            setShoppingCartTotal(product);
        }
    }, [props.shoppingCartEntries])

    return (
        <div id="shopping-cart-button-container">
            <div id="shopping-cart-button">
                {shoppingCartNumberOfItems > 0 && <p id="shopping-cart-button-item-count">{shoppingCartNumberOfItems}</p>}
                <span className="material-symbols-outlined" id="navbar-shopping-cart-icon">shopping_cart</span>
                <p id="shopping-cart-button-text">Shopping cart</p>
            </div>
            <div id="shopping-cart-button-dropdown">
                <div id = "shopping-cart-button-title-div">{props.shoppingCartEntries.length > 0 ? "Products" : "No products in cart"}</div>
                <div id = "shopping-cart-button-dropdown-list">
                    {props.shoppingCartEntries &&
                        props.shoppingCartEntries.map((entry:ShoppingCartEntry) => (
                            <div key={entry.shoppingCartEntryID} className = "shopping-cart-button-map-entry">
                                <ShoppingCartButtonEntry entry = {entry}
                                                         shoppingCartEntries={props.shoppingCartEntries}
                                                         setShoppingCartEntries ={props.setShoppingCartEntries}
                                                         isLoggedIn = {props.isLoggedIn}>
                                </ShoppingCartButtonEntry>
                                <hr/>
                            </div>
                        ))}
                </div>
                    <div id="shopping-cart-button-summary-div">
                        {props.shoppingCartEntries.length > 0 &&
                        <div>
                            <p id="shopping-cart-button-summary-div-total">{"TOTAL: " + shoppingCartNumberOfItems + " products"}</p>
                            <p id="shopping-cart-button-summary-div-price">{"price: " + shoppingCartTotal + " $"}</p>
                        </div>
                        }
                        <button className="cover-button" id="shopping-cart-button-summary-button">See cart details</button>
                    </div>

            </div>
        </div>
    );
}

export default ShoppingCartButton;