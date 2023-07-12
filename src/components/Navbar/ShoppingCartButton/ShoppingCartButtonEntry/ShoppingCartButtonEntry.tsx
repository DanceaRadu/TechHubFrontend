import ShoppingCartEntry from "../../../../models/ShoppingCartEntry";
import './ShoppingCartButtonEntry.css'
import useFetchImage from "../../../../hooks/useFetchImage";



function ShoppingCartButtonEntry(props:any) {

    let product:ShoppingCartEntry = props.entry;
    const imageID = product?.product.productImages[0]?.image?.imageID;

    // Call useFetchImage unconditionally
    const { imageSourceUrl, error, isPending } = useFetchImage(imageID)

    return(
        <div id="shopping-cart-button-entry-container">
            {!error && !isPending && <img id="shopping-cart-button-entry-image" src={imageSourceUrl} alt="asd"/>}
            {(isPending || error) ? (
                <img id="shopping-cart-button-entry-image" src={require('../../../../resources/images/whiteSquare.png')}  alt="asdasd"/>
            ) : null}
            <div id="shopping-cart-button-entry-product-name">{product.product.productName}</div>
            <div id="shopping-cart-button-entry-product-quantity">{product.quantity}</div>
        </div>
    )
}

export default ShoppingCartButtonEntry;