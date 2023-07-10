import React, {useEffect, useState} from "react";
import './ShoppingCartButton.css'
import ShoppingCartButtonEntry from "./ShoppingCartButtonEntry/ShoppingCartButtonEntry";
import ShoppingCartEntry from "../../../models/ShoppingCartEntry";

function ShoppingCartButton(props:any) {

    const [shoppingCartNumberOfItems, setShoppingCartNumberOfItems] = useState<number>(0);
    let isLoggedIn:boolean = props.isLoggedIn;
    let isPendingLoggedIn = props.isPendingLoggedIn

    useEffect(() => {
        // Code to run when the component is first loaded
        console.log(props.shoppingCartEntries);
    }, [props.shoppingCartEntries]);

    useEffect(() => {
        if(props.shoppingCartEntries !== undefined) {
            console.log(props.shoppingCartEntries);
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
                {props.shoppingCartEntries &&
                    props.shoppingCartEntries.map((entry:ShoppingCartEntry) => (
                        <div key={entry.shoppingCartEntryID}>
                            <ShoppingCartButtonEntry entry = {entry}></ShoppingCartButtonEntry>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default ShoppingCartButton;