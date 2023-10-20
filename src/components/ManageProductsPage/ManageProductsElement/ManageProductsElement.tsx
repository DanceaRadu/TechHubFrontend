import './ManageProductsElement.css'
import Product from "../../../models/Product";
import useFetchImage from "../../../hooks/useFetchImage";
import React, {useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";
import config from "../../../config";

function ManageProductsElement(props:any) {

    let product:Product = props.entry;

    const imageID = product?.productImages[0]?.image?.imageID;
    const { imageSourceUrl, error:errorImageFetch, isPending:imageFetchPending } = useFetchImage(imageID);
    const [tempStock, setTempStock] = useState<number>(product.stock);
    const [isStockButtonDisabled, setIsStockButtonDisabled] = useState<boolean>(false);

    const [isStockMessageVisible, setIsStockMessageVisible] = useState<boolean>(false);
    const [stockMessage, setStockMessage] = useState<string>("-");

    const [isDeletePending, setIsDeletePending] = useState<boolean>(false);

    function handleStockChange(e:any) {

        e.preventDefault();
        setIsStockButtonDisabled(true);
        setIsStockMessageVisible(false);
        setStockMessage("-");

        if(tempStock > 2000000000) {
            setStockMessage("Too big");
            setIsStockMessageVisible(true);
            setIsStockButtonDisabled(true);
            setTempStock(product.stock);
            const timer = setTimeout(() => {
                setIsStockMessageVisible(false);
                setIsStockButtonDisabled(false);
            }, 2000);
            return;
        }

        // @ts-ignore
        if(isNaN(tempStock)) setTempStock(0);

        const productId = product.productID;
        const patchData = [
            { op: 'replace', path: '/stock', value: tempStock}
        ];

        fetch(config.apiUrl + `/product/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json',
                "Origin": config.origin,
                "Authorization": "Bearer " + Cookies.get('jwtToken')
            },
            body: JSON.stringify(patchData),
        })
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                setStockMessage("Updated!");
                setIsStockMessageVisible(true);
                product.stock = tempStock;
                const timer = setTimeout(() => {
                    setIsStockMessageVisible(false);
                    setIsStockButtonDisabled(false);
                }, 2000);
            })
            .catch(() => {
                setStockMessage("Error!");
                setIsStockMessageVisible(true);
                setTempStock(product.stock);
                const timer = setTimeout(() => {
                    setIsStockMessageVisible(false);
                    setIsStockButtonDisabled(false);
                }, 2000);
            });
    }

    function handleProductDelete() {
        setIsDeletePending(true);

        fetch(config.apiUrl + "/product/" + product.productID,
            {
                method: 'DELETE',
                headers: {
                    "Origin": config.origin,
                    "Authorization": "Bearer " + Cookies.get('jwtToken')
                }
            })
            .then(response => {
                if (!response.ok) {
                    setIsDeletePending(false);
                    throw new Error('Network response was not ok');
                }
                window.location.reload();
            })
            .catch(() => {
                setIsDeletePending(false);
                alert("Something went wrong. Please try again");
            })
    }

    return (
        <div id = "manage-product-element-div">
            <div id="manage-product-element-left-side">
                {imageFetchPending || errorImageFetch ? (
                    <img id="manage-product-element-placeholder-image" src={require('../../../resources/images/product-placeholder.jpg')}  alt="Product"/>
                ) : null}
                {!errorImageFetch && !imageFetchPending && <img id="manage-product-image" src={imageSourceUrl} alt="Product"/>}
                <div id="manage-product-element-name-div">
                    <p>{product.productName}</p>
                    <p style={{color:"var(--accent-color)", fontSize:18}}>{product.productPrice  + " USD"}</p>
                </div>
            </div>
            <div id="manage-product-element-stock-div">
                <p>Stock</p>
                <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                    <form onSubmit={handleStockChange}>
                        <input
                            type ="number"
                            id="manage-product-element-stock-input"
                            value={tempStock}
                            min="0" max="2000000000"
                            onChange={(e)=>{
                                setTempStock(parseInt(e.target.value))
                            }
                            }
                        />
                    </form>
                    <button id="manage-product-stock-update-button" onClick={handleStockChange} disabled={isStockButtonDisabled}>Set</button>
                </div>
                <div id={isStockMessageVisible ? "manage-product-element-stock-update-notification":"manage-product-element-stock-update-notification-fade"}>{stockMessage}</div>
            </div>
            {!isDeletePending && <span className="material-symbols-outlined" id="manage-products-element-delete-icon" onClick={handleProductDelete}>delete</span>}
            {isDeletePending &&
                <div className="lds-roller">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>}
        </div>
    )
}

export default ManageProductsElement;