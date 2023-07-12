import Image from './Image';
import Product from './Product';
import {UUID} from "crypto";

class ProductImage {
    productImageID: UUID;
    image: Image;
    product: Product;

    constructor(productImageID: UUID, image: Image, product: Product) {
        this.productImageID = productImageID;
        this.image = image;
        this.product = product;
    }
}

export default ProductImage;