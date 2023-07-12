import React, {useEffect, useState} from "react";
import './ShoppingCartButton.css'
import ShoppingCartButtonEntry from "./ShoppingCartButtonEntry/ShoppingCartButtonEntry";
import ShoppingCartEntry from "../../../models/ShoppingCartEntry";

function ShoppingCartButton(props:any) {

    const [shoppingCartNumberOfItems, setShoppingCartNumberOfItems] = useState<number>(0);
    let isLoggedIn:boolean = props.isLoggedIn;
    let isPendingLoggedIn = props.isPendingLoggedIn

    useEffect(() => {
        if(props.shoppingCartEntries !== undefined) {
            let sum: number = 0;
            for (let i = 0; i < props.shoppingCartEntries.length; i++) {
                sum = sum + props.shoppingCartEntries[i].quantity;
            }
            setShoppingCartNumberOfItems(sum);
        }
    }, [props.shoppingCartEntries])

    return (
        <div id="shopping-cart-button-container">
            <div id="shopping-cart-button">
                <span className="material-symbols-outlined" id="navbar-shopping-cart-icon">shopping_cart</span>
                <p id="shopping-cart-button-text">Shopping cart</p>
            </div>
            <div id="shopping-cart-button-dropdown">
                <div id = "shopping-cart-button-title-div">Products</div>
                <div id = "shopping-cart-button-dropdown-list">
                    {props.shoppingCartEntries &&
                        props.shoppingCartEntries.map((entry:ShoppingCartEntry) => (
                            <div key={entry.shoppingCartEntryID} className = "shopping-cart-button-map-entry">
                                <ShoppingCartButtonEntry entry = {entry}></ShoppingCartButtonEntry>
                                <hr/>
                            </div>
                        ))}
                </div>
                <div id="shopping-cart-button-summary-div">total</div>
            </div>
        </div>
    );
}

export default ShoppingCartButton;