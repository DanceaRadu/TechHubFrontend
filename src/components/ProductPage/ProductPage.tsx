import './ProductPage.css'
import Navbar from "../Navbar/Navbar";
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import React, {useEffect, useState} from "react";
import config from "../../config";
import {useParams} from "react-router-dom";
import ProductImageSlider from "./ProductImageSlider/ProductImageSlider";
import ProductPageSummaryDiv from "./ProductPageSummaryDiv/ProductPageSummaryDiv";

function ProductPage(props:any) {

    const {isLoggedIn, isPending} = useCheckLoggedIn();
    const [isPendingProductFetch, setIsPendingProductFetch] = useState<boolean>(true);
    const [productFetchError, setProductFetchError] = useState<string>("");
    const [productData, setProductData] = useState<any>(null)

    const {productId} = useParams();

    useEffect(() => {

        setIsPendingProductFetch(true);
        setProductFetchError("");

        fetch(config.apiUrl + "/product/" + productId,
            {method: 'GET',
                headers: {
                    "Origin":config.origin,
                },
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                setProductData(data);
                setIsPendingProductFetch(false);
            })
            .catch(() => {
                setIsPendingProductFetch(false);
                setProductFetchError("Error fetching product info. Please try again.");
            })
    }, [productId])


    return (
        <div className="background-div">
            <Navbar
                isLoggedIn={isLoggedIn}
                isPendingLoggedIn={isPending}
                shoppingCartEntries={props.shoppingCartEntries}
                setShoppingCartEntries = {props.setShoppingCartEntries}>
            </Navbar>
            {isPendingProductFetch && <div className="lds-roller" id="product-page-loading-animation">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>}
            {!isPendingProductFetch && productFetchError && <div id="product-page-fetch-error">{productFetchError}</div>}

            {productData && !isPendingProductFetch && <div id="product-page-outer-div">
                <div id="product-page-inner-div">


                    <p id="product-page-name-p">{productData.productName}</p>
                    <div id="product-page-first-div">
                        <div id="product-page-images-div">
                            <ProductImageSlider imageList = {productData.productImages}></ProductImageSlider>
                        </div>
                        <div id="product-page-second-div">
                            <ProductPageSummaryDiv productData = {productData}></ProductPageSummaryDiv>
                        </div>
                    </div>
                    <div id="product-page-sections-div"></div>


                </div>
            </div>}
        </div>
    )
}

export default ProductPage;