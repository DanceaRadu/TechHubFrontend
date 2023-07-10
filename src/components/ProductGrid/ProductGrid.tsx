import './ProductGrid.css'
import {useEffect, useState} from "react";
import Product from "../../models/Product";
import ProductPreview from "../ProductPreview/ProductPreview";


function ProductGrid(props:any) {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/product/all",
            {method: 'GET',
                headers: {"Origin":"http://localhost:8080:3000"
            }})
            .then(res => {
                return res.json();
            })
            .then(data => {
                setProducts(data);
                console.log(data);
            })
    }, [])

    return (
        <div id="product-grid-container">
            {products &&
                products.map((product) => (
                    <div key={product.productID}>
                        <ProductPreview product = {product} shoppingCartEntries={props.shoppingCartEntries} setShoppingCartEntries={props.setShoppingCartEntries}></ProductPreview>
                    </div>
                ))}
        </div>
    );
}

export default ProductGrid;