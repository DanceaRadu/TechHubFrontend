import ProductCategory from "./ProductCategory";

class ProductDTO {
    public productPrice: number;
    public productName: string;
    public description: string;
    public stock: number;
    public specs: string;
    public productCategory: ProductCategory;
    constructor(productName:string, productPrice:number, description:string, stock:number, specs:string, productCategory:ProductCategory) {
        this.productName = productName;
        this.productPrice = productPrice;
        this.description = description;
        this.stock = stock;
        this.specs = specs;
        this.productCategory = productCategory;
    }
}

export default ProductDTO;