import {UUID} from "crypto";
import Product from "./Product";

class ShoppingCartEntry {
    public shoppingCartEntryID: UUID;
    public product: Product;
    public quantity: number;

    constructor(shoppingCartEntryID:UUID, product:Product, quantity:number) {
        this.shoppingCartEntryID = shoppingCartEntryID;
        this.product = product;
        this.quantity = quantity;
    }
}
export default ShoppingCartEntry;