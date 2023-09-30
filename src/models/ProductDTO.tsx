class ProductDTO {
    public productPrice: number;
    public productName: string;
    public description: string;
    public stock: number;
    constructor(productName:string, productPrice:number, description:string, stock:number) {
        this.productName = productName;
        this.productPrice = productPrice;
        this.description = description;
        this.stock = stock;
    }
}

export default ProductDTO;