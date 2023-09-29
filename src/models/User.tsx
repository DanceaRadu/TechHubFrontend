import {UUID} from "crypto";
import Product from "./Product";
import image from "./Image";

class User {
    public _username: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public role:string;
    public profileImage:image;

    constructor(_username: string, firstName: string, lastName: string, email: string, role: string, profileImage: image) {
        this._username = _username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.profileImage = profileImage;
    }
}
export default User;