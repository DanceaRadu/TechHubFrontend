import './ManageProductsPage.css'
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Product from "../../models/Product";
import ManageProductsElement from "./ManageProductsElement/ManageProductsElement";
import AddProductPage from "./AddProductPage/AddProductPage";
// @ts-ignore
import Cookies from "js-cookie";

function ManageProductsPage() {

    const {pageParam} = useParams();
    const [fetchError, setFetchError] = useState<boolean>(false);
    const [fetchPending, setFetchPending] = useState<boolean>(true);
    const [productList, setProductList] = useState<Product[]>([]);
    const [isAddProduct, setIsAddProduct] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {

        setIsAddProduct(false);
        setFetchError(false);
        setFetchPending(true);

        //fetch the account info to verify that the user is an ADMIN and can access this page
        fetch("http://localhost:8080/api/v1/user",
            {
                method: 'GET',
                headers: {
                    "Origin": "http://localhost:8080:3000",
                    "Authorization": "Bearer " + Cookies.get('jwtToken')
                }
            }
        )
            .then(res => {
                if (!res.ok) throw Error("Could not fetch user info");
                return res.json();
            })
            .then(data => {
                if(data.role === "USER") navigate("/");
                else {
                    // @ts-ignore
                    if(!isNaN(pageParam)) {
                        // @ts-ignore
                        fetch("http://localhost:8080/api/v1/product/paginate?pageNumber=" + (pageParam - 1) + "&pageSize=20",
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
                                if (data.content.length === 0) throw Error("No more products");
                            })
                            .catch(() => {
                                setFetchPending(false);
                                setFetchError(true);
                            })
                    }
                    else {
                        if(pageParam === "add") setIsAddProduct(true);
                    }
                }
            })
            .catch(err => {
            })
    }, [pageParam, navigate])

    return (
        <div id = "manage-products-list-div">
            {!fetchPending && !fetchError && !isAddProduct && <div>
                <button className ="cover-button" id="manage-products-add-button" onClick={() => navigate("/account/manage/add")}><span className="material-symbols-outlined" id="manage-products-page-add-icon">add</span>Add</button>
                <div>
                    {productList.length > 0 &&
                        productList.map((entry:Product) => (
                            <div key={entry.productID} className = "manage-products-entry">
                                <ManageProductsElement entry = {entry}>
                                </ManageProductsElement>
                            </div>
                        ))}
                </div>
            </div>}
            {isAddProduct && <AddProductPage></AddProductPage>}
        </div>
    );
}

export default ManageProductsPage;