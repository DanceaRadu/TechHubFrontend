import {UUID} from "crypto";

class Image {
    imageID: UUID;
    filename: string;
    filePath: string;

    constructor(imageID: UUID, filename: string, filePath: string) {
        this.imageID = imageID;
        this.filename = filename;
        this.filePath = filePath;
    }
}

export default Image;