import './ManageProductsPage.css'
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Product from "../../models/Product";
import ManageProductsElement from "./ManageProductsElement/ManageProductsElement";
import AddProductPage from "./AddProductPage/AddProductPage";
// @ts-ignore
import Cookies from "js-cookie";
import PaginationElement from "../PaginationElement/PaginationElement";

function ManageProductsPage() {

    const {pageParam} = useParams();
    const {searchQuery} = useParams();

    const [fetchError, setFetchError] = useState<string>("");
    const [fetchPending, setFetchPending] = useState<boolean>(true);
    const [productList, setProductList] = useState<Product[]>([]);
    const [isAddProduct, setIsAddProduct] = useState<boolean>(false);

    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
    const [searchFieldValue, setSearchFieldValue] = useState<string>("");
    const [totalPages, setTotalPages] = useState<number>(0);

    const navigate = useNavigate();

    useEffect(() => {

        setIsAddProduct(false);
        setFetchError("");
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

                    let apiPath:string;
                    // @ts-ignore
                    if(!isNaN(pageParam)) {
                        if(searchQuery === undefined) { // @ts-ignore
                            apiPath = "http://localhost:8080/api/v1/product/paginate?pageNumber=" + (pageParam - 1) + "&pageSize=10"
                        }
                        else {
                            // @ts-ignore
                            apiPath = "http://localhost:8080/api/v1/product/paginate/search?pageNumber=" + (pageParam - 1) + "&pageSize=10&query=" + searchQuery;
                        }

                        fetch(apiPath,
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
                                setTotalPages(data.totalPages);
                                setProductList(data.content);
                                setFetchPending(false);
                                setFetchError("");
                                if (data.content.length === 0) throw Error("No more products");
                            })
                            .catch((e) => {
                                setFetchPending(false);
                                setFetchError(e.message);
                            })
                    }
                    else if(pageParam === "add") {
                            setFetchPending(false);
                            setIsAddProduct(true);
                    }
                }
            })
            .catch(() => {
                setFetchError("Something went wrong. Please try again");
                setFetchPending(false);
            })
    }, [pageParam, navigate, searchQuery])

    function searchProducts(e:any) {
        e.preventDefault();
        if(searchFieldValue === "") navigate("/account/manage/1")
        else navigate("/account/manage/search/" + searchFieldValue + "/1");
    }

    return (
        <div id = "manage-products-list-div">

            {!isAddProduct && <form onSubmit={searchProducts}>
                <div id="manage-products-page-search-bar-outer-div">
                    <div id="manage-products-page-search-bar-div" style={{border: isSearchFocused ? '2px solid #730075' : '2px solid #AAAAAA'}}>
                        <input
                            type="text"
                            id="manage-products-page-search-input"
                            value = {searchFieldValue}
                            onChange={(e) => setSearchFieldValue(e.target.value)}
                            placeholder = "Search for a product"
                            onBlur={() => setIsSearchFocused(false)}
                            onFocus={() => setIsSearchFocused(true)}
                        />
                        <span className="material-symbols-outlined" id="manage-products-page-search-icon" onClick={searchProducts}>search</span>
                    </div>
                </div>
            </form>}
            {!isAddProduct && <button className ="cover-button" id="manage-products-add-button" onClick={() => navigate("/account/manage/add")}><span className="material-symbols-outlined" id="manage-products-page-add-icon">add</span>Add</button>}
            {fetchPending &&
                <div id="lds-roller-outer-div">
                    <div className="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>}
            {fetchError && <div id="manage-product-page-error-div">{fetchError}</div>}
            {!fetchPending && !fetchError && !isAddProduct && <div>
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
            {!isAddProduct && !fetchPending && <PaginationElement currentPageNumber={pageParam}
                                                 totalPagesNumber={totalPages}
                                                 linkBeginning = {window.location.pathname.replace(/\/\d+$/, '')}
                                                 linkEnding = ""
                                                 ></PaginationElement>}
        </div>
    );
}

export default ManageProductsPage;