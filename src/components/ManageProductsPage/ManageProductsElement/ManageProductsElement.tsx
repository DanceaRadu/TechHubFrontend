import './ManageProductsElement.css'
import Product from "../../../models/Product";
import useFetchImage from "../../../hooks/useFetchImage";
import React, {useEffect, useState} from "react";

function ManageProductsElement(props:any) {

    let product:Product = props.entry;

    const imageID = product?.productImages[0]?.image?.imageID;
    const { imageSourceUrl, error:errorImageFetch, isPending:imageFetchPending } = useFetchImage(imageID);
    const [tempStock, setTempStock] = useState<number>(product.stock);
    const [isStockButtonDisabled, setIsStockButtonDisabled] = useState<boolean>(false);
    const [isStockMessageVisible, setIsStockMessageVisible] = useState<boolean>(false);

    function handleStockChange(e:any) {
        e.preventDefault();
        setIsStockButtonDisabled(true);
        setIsStockMessageVisible(true)

        const timer = setTimeout(() => {
            setIsStockMessageVisible(false);
            setIsStockButtonDisabled(false);
        }, 2000);
    }

    return (
        <div id = "manage-product-element-div">
            <div id="manage-product-element-left-side">
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
                            onChange={(e)=>{
                                setTempStock(parseInt(e.target.value))
                            }
                            }
                        />
                    </form>
                    <button id="manage-product-stock-update-button" onClick={handleStockChange} disabled={isStockButtonDisabled}>Set</button>
                </div>
                <div id={isStockMessageVisible ? "manage-product-element-stock-update-notification":"manage-product-element-stock-update-notification-fade"}>Updated stock!</div>
            </div>
            <span className="material-symbols-outlined" id="manage-products-element-delete-icon">delete</span>
        </div>
    )

}

export default ManageProductsElement;