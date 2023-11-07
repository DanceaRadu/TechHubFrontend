import './FeaturedProductsGrid.css'
import React, {useEffect, useState} from "react";
import config from "../../../config";
import Product from "../../../models/Product";
import ProductPreview from "../../ProductPreview/ProductPreview";
import useFetchUserFavorites from "../../../hooks/useFetchUserFavorites";

function FeaturedProductsGrid(props:any) {

    const [products, setProducts] = useState<Product[]>([]);
    const {favorites, setFavorites, error: errorFavorites, isPending: isPendingFavorites} = useFetchUserFavorites(props.isLoggedIn);

    useEffect(() => {

        const productSorter = {
            productCategory: {categoryID: "cc0ef8af-8386-4dac-8526-97f2e997de9f"}, //all
            order: "none",
            filter: "none",
            query: "undefined",
            pageNumber: 1,
            pageSize: 10,
        };

        fetch(config.apiUrl + "/product/paginate/filter",
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
                setProducts(data.content);
            })
            .catch(() => {
            })
    }, [])

    return (
        <div id="featured-product-grid-outer-div">
            {products.map((product) => (
            <div key={product.productID}>
                <ProductPreview
                    product = {product}
                    isLoggedIn = {props.isLoggedIn}
                    shoppingCartEntries={props.shoppingCartEntries}
                    setShoppingCartEntries={props.setShoppingCartEntries}
                    favorites = {favorites}
                    setFavorites = {setFavorites}
                ></ProductPreview>
            </div>
            ))}
        </div>
    )
}

export default FeaturedProductsGrid