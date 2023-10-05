import './ProductGrid.css'
import {useEffect, useState} from "react";
import Product from "../../models/Product";
import ProductPreview from "../ProductPreview/ProductPreview";
import config from "../../config";

function ProductGrid(props:any) {

    const [products, setProducts] = useState<Product[]>([]);

    const category = props.category;
    const order = props.order;
    const filter = props.filters;
    const query = props.query;
    const pageNumber = props.pageNumber;

    const productSorter = {
        productCategory: {categoryID: category},
        order: order,
        filter: filter,
        query: query,
        pageNumber: pageNumber,
        pageSize: 10,
    };

    useEffect(() => {

        fetch("http://localhost:8080/api/v1/product/paginate/filter",
            {method: 'POST',
                headers: {
                "Origin":config.origin,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productSorter)
            })
            .then(res => {
                console.log(productSorter);
                return res.json();
            })
            .then(data => {
                setProducts(data.content);
            })
    }, [category, order, filter, query, pageNumber])

    return (
        <div id="product-grid-container">
            {products &&
                products.map((product) => (
                    <div key={product.productID}>
                        <ProductPreview product = {product} isLoggedIn = {props.isLoggedIn} shoppingCartEntries={props.shoppingCartEntries} setShoppingCartEntries={props.setShoppingCartEntries}></ProductPreview>
                    </div>
                ))}
        </div>
    );
}

export default ProductGrid;