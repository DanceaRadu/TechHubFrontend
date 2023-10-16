class ProductDTO {
    public productPrice: number;
    public productName: string;
    public description: string;
    public stock: number;
    public specs: string;
    constructor(productName:string, productPrice:number, description:string, stock:number, specs:string) {
        this.productName = productName;
        this.productPrice = productPrice;
        this.description = description;
        this.stock = stock;
        this.specs = specs;
    }
}

export default ProductDTO;