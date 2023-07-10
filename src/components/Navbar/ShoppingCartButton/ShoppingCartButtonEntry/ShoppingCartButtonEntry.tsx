import ShoppingCartEntry from "../../../../models/ShoppingCartEntry";
import './ShoppingCartButtonEntry.css'

function ShoppingCartButtonEntry(props:any) {
    let product:ShoppingCartEntry = props.entry;
    return(
        <div id="shopping-cart-button-entry-container">
            <div id="shopping-cart-button-entry-product-name">{product.product.productName}</div>
            <div id="shopping-cart-button-entry-product-quantity">{product.quantity}</div>
        </div>
    )
}

export default ShoppingCartButtonEntry;