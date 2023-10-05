import './ProductGrid.css'
import React, {useEffect, useState} from "react";
import Product from "../../models/Product";
import ProductPreview from "../ProductPreview/ProductPreview";
import config from "../../config";
import PaginationElement from "../PaginationElement/PaginationElement";

function ProductGrid(props:any) {

    const [products, setProducts] = useState<Product[]>([]);
    const [isPendingFetchProducts, setIsPendingFetchProducts] = useState<boolean>(true);
    const [fetchProductsFetchError, setProductsFetchError] = useState<string>("")

    const [numberOfPages, setNumberOfPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const category = props.category;
    const order:string = props.order;
    const filter:string = props.filters;
    const query:string = props.query;
    const pageNumber:number = props.pageNumber;

    const productSorter = {
        productCategory: {categoryID: category},
        order: order,
        filter: filter,
        query: query !== undefined ? query : "undefined",
        pageNumber: pageNumber,
        pageSize: 20,
    };

    useEffect(() => {
        let apiPath:string;
        if(query === undefined) apiPath = "/product/paginate/filter";
        else apiPath = "/product/paginate/filter/query"

        setProductsFetchError("");
        setIsPendingFetchProducts(true);
        setNumberOfPages(0);
        setTotalElements(0);

        fetch(config.apiUrl + apiPath,
            {method: 'POST',
                headers: {
                "Origin":config.origin,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productSorter)
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                setProductsFetchError("");
                setIsPendingFetchProducts(false);
                setProducts(data.content);
                setNumberOfPages(data.numberOfPages);
                setTotalElements(data.totalElements);
                if(data.content.length === 0) setProductsFetchError("No more products");
            })
            .catch(() => {
                setIsPendingFetchProducts(false);
                setProductsFetchError("Error loading products.")
            })
    }, [category, order, filter, query, pageNumber])

    return (
        <div id="product-grid-outer-container">
            {fetchProductsFetchError && <div id="product-grid-error-div">
                {query ? "No results found" : fetchProductsFetchError}
            </div>}
            {isPendingFetchProducts && <div className="lds-roller" id="product-grid-loading-animation">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>}
            {query && !isPendingFetchProducts && !fetchProductsFetchError && <div id="product-grid-query-div">{totalElements} results for '{query}'</div>}
            <div id="product-grid-container">
                {products && !fetchProductsFetchError && !isPendingFetchProducts &&
                    products.map((product) => (
                        <div key={product.productID}>
                            <ProductPreview product = {product} isLoggedIn = {props.isLoggedIn} shoppingCartEntries={props.shoppingCartEntries} setShoppingCartEntries={props.setShoppingCartEntries}></ProductPreview>
                        </div>
                    ))}
            </div>
            {!fetchProductsFetchError && !isPendingFetchProducts && <PaginationElement currentPageNumber={pageNumber}
                               totalPagesNumber={numberOfPages}
                               linkBeginning = {"/browse/" + category + "/" + order + "/" + filter}
                               linkEnding = {(query !== undefined ? ("/" + query) : '')}
            ></PaginationElement>}
        </div>
    );
}

export default ProductGrid;