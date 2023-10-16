import './ProductPage.css'
import './../../index.css'
import Navbar from "../Navbar/Navbar";
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import React, {useEffect, useState} from "react";
import config from "../../config";
import {useParams} from "react-router-dom";
import ProductImageSlider from "./ProductImageSlider/ProductImageSlider";
import ProductPageSummaryDiv from "./ProductPageSummaryDiv/ProductPageSummaryDiv";
import ProductPageReviewsSection from "./ProductPageReviewsSection/ProductPageReviewsSection";
function ProductPage(props:any) {

    const {isLoggedIn, isPending} = useCheckLoggedIn();
    const [isPendingProductFetch, setIsPendingProductFetch] = useState<boolean>(true);
    const [productFetchError, setProductFetchError] = useState<string>("");
    const [productData, setProductData] = useState<any>(null);

    const [isDescriptionSelected, setIsDescriptionSelected] = useState<boolean>(true);
    const [isSpecsSelected, setIsSpecsSelected] = useState<boolean>(false);
    const [isReviewsSelected, setIsReviewsSelected] = useState<boolean>(false);

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

    function changeToDescription() {
        setIsDescriptionSelected(true);
        setIsSpecsSelected(false);
        setIsReviewsSelected(false);
    }

    function changeToSpecs() {
        setIsDescriptionSelected(false);
        setIsSpecsSelected(true);
        setIsReviewsSelected(false);
    }

    function changeToReviews() {
        setIsDescriptionSelected(false);
        setIsSpecsSelected(false);
        setIsReviewsSelected(true);
    }


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
                            <ProductPageSummaryDiv
                                productData = {productData}
                                isLoggedIn = {isLoggedIn}
                                shoppingCartEntries = {props.shoppingCartEntries}
                                setShoppingCartEntries = {props.setShoppingCartEntries}
                            ></ProductPageSummaryDiv>
                        </div>
                    </div>
                    <div id="product-page-sections-div">
                        <div id = "product-page-sections-buttons-div">
                            <div className={isDescriptionSelected ? "product-page-sections-button-div-selected" : "product-page-sections-button-div"} onClick={changeToDescription}>Description</div>
                            <div className={isSpecsSelected ? "product-page-sections-button-div-selected" : "product-page-sections-button-div"} onClick={changeToSpecs}>Specs</div>
                            <div className={isReviewsSelected ? "product-page-sections-button-div-selected" : "product-page-sections-button-div"} onClick={changeToReviews}>Reviews</div>
                        </div>
                        <div id = "product-page-sections-content-div">
                            {isDescriptionSelected && <div id="product-page-sections-description-div">{productData.description}</div>}
                            {isReviewsSelected && <ProductPageReviewsSection isLoggedIn = {isLoggedIn} productData = {productData}></ProductPageReviewsSection>}
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default ProductPage;