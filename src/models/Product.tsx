import {UUID} from "crypto";
import ProductImage from "./ProductImage";

class Product {
    public productID: UUID;
    public productPrice: number;
    public productName: string;
    public description: string;
    public productImages: ProductImage[];
    public stock: number;
    constructor(productID:UUID, productName:string, productPrice:number, description:string, stock:number, productImages:ProductImage[]) {
        this.productID = productID;
        this.productName = productName;
        this.productPrice = productPrice;
        this.description = description;
        this.stock = stock;
        this.productImages = productImages;
    }
}

export default Product;