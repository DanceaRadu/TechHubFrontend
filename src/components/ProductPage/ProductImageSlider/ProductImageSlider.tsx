import './ProductImageSlider.css'
import {useEffect, useState} from "react";
import useFetchImageList from "../../../hooks/useFetchImageList";
function ProductImageSlider(props:any) {

    const imageList = props.imageList;

    const { imageSourceUrls, error: imagesFetchError, isPending: isPendingImages } = useFetchImageList(imageList);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    useEffect(() => {
         console.log("-------------------------------------");
        console.log(imageSourceUrls)
    }, [imageSourceUrls])

    return (
        <div id="product-slider-outer-div">
            <img src={imageSourceUrls[currentImageIndex]} alt="product" id="product-image-slider-bigger-image"/>
            <div id="product-slider-smaller-images-outer-div">
                <button className="product-image-slider-navigation-button">&lt;</button>
                {<div id="product-slider-smaller-images-div">
                    {imageSourceUrls.length > 0 && !isPendingImages && imageSourceUrls.map((imageUrl:string, index:number) => (
                        <img key={index} src={imageUrl} alt={`Product`} className="product-image-slider-small-image" />
                    )
                )}
                </div>}
                <button className = "product-image-slider-navigation-button">&gt;</button>
            </div>
        </div>
    )

}

export default ProductImageSlider;