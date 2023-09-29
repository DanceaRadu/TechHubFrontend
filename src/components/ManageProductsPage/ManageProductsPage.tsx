import './ManageProductsPage.css'
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Product from "../../models/Product";
import ShoppingCartEntry from "../../models/ShoppingCartEntry";
import ShoppingCartButtonEntry from "../Navbar/ShoppingCartButton/ShoppingCartButtonEntry/ShoppingCartButtonEntry";
import ManageProductsElement from "./ManageProductsElement/ManageProductsElement";

function ManageProductsPage() {

    const {pageNumber} = useParams();
    const [fetchError, setFetchError] = useState<boolean>(false);
    const [fetchPending, setFetchPending] = useState<boolean>(true);
    const [productList, setProductList] = useState<Product[]>([]);

    useEffect(() => {
        // @ts-ignore
        fetch("http://localhost:8080/api/v1/product/paginate?pageNumber=" + (pageNumber-1) + "&pageSize=50",
            {
                method: 'GET',
                headers: {
                    "Origin": "http://localhost:8080:3000",
                }
            }
        )
            .then(res => {
                if (!res.ok) throw Error("Could not fetch products");
                return res.json();
            })
            .then(data => {
                setProductList(data.content);
                setFetchPending(false);
                setFetchError(false);
                console.log(data.content.length);
                if(data.content.length === 0) throw Error("No more products");
            })
            .catch(err => {
                setFetchPending(false);
                setFetchError(true);
            })
    }, [pageNumber])

    return (
        <div id = "manage-products-list-div">
            {productList.length > 0 &&
                productList.map((entry:Product) => (
                    <div key={entry.productID} className = "manage-products-entry">
                        <ManageProductsElement entry = {entry}>
                        </ManageProductsElement>
                    </div>
                ))}
        </div>
    );
}

export default ManageProductsPage;