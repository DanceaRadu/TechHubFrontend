import {UUID} from "crypto";
class ProductCategory {
    public categoryID:UUID;
    public categoryName: string;

    constructor(categoryID:UUID, categoryName:string) {
        this.categoryID = categoryID;
        this.categoryName = categoryName;
    }
}

export default ProductCategory;