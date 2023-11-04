import './ProductImageSlider.css'
import React, {useEffect, useState} from "react";
import useFetchImageList from "../../../hooks/useFetchImageList";
import CustomPopup from "../../CustomPopup/CustomPopup";

function ProductImageSlider(props:any) {

    const imageList = props.imageList;

    const { imageSourceUrls, error: imagesFetchError, isPending: isPendingImages } = useFetchImageList(imageList);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [previousImageIndex, setPreviousImageIndex] = useState<number>(0);

    const [enlargedImageUrl, setEnlargedImageUrl] = useState<string>("");
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

    function handleImageHover(index:number) {
        if(index >= 0 && index < imageSourceUrls.length) {
            setPreviousImageIndex(currentImageIndex);
            setCurrentImageIndex(index);
        }
    }

    function handleImageClick(imageUrl:string) {
        setEnlargedImageUrl(imageUrl);
        setIsPopupVisible(true);
    }

    useEffect(() => {
        const scrollDiv = document.getElementById('product-slider-smaller-images-div');
        if (scrollDiv) {
            if (currentImageIndex > previousImageIndex) {
                const currentScrollLeft = scrollDiv.scrollLeft;
                const maxScrollLeft = scrollDiv.scrollWidth - scrollDiv.clientWidth;
                const newScrollLeft = Math.min(currentScrollLeft + 85, maxScrollLeft);
                if (newScrollLeft !== currentScrollLeft) {
                    scrollDiv.scrollLeft = newScrollLeft;
                }
            } else if (currentImageIndex < previousImageIndex) {
                const currentScrollLeft = scrollDiv.scrollLeft;
                const newScrollLeft = Math.max(currentScrollLeft - 85, 0);
                if (newScrollLeft !== currentScrollLeft) {
                    scrollDiv.scrollLeft = newScrollLeft;
                }
            }
        }
    }, [previousImageIndex, currentImageIndex, imageSourceUrls]);

    return (
        <div id="product-slider-outer-div">
            <div id="product-image-slider-bigger-image-div">
                {isPendingImages || imagesFetchError ? (
                    <img className="product-image-slider-bigger-image" style={{position:"relative", left:0}} src={require('../../../resources/images/product-placeholder.jpg')}  alt="Product"/>
                ) : null}
                {imageSourceUrls.length > 0 && !isPendingImages && imageSourceUrls.map((imageUrl:string, index:number) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Product`}
                            className="product-image-slider-bigger-image"
                            style={{left: -500*currentImageIndex}}
                        />
                    )
                )}
            </div>
            <div id="product-slider-smaller-images-outer-div">
                <button className="product-image-slider-navigation-button" onClick={() => handleImageHover(currentImageIndex - 1)}>&lt;</button>
                {<div id="product-slider-smaller-images-div">

                    {isPendingImages || imagesFetchError ? ( imageList.map((image:any, index:number) => (
                        <img key={index} className="product-image-slider-small-image-selected" src={require('../../../resources/images/product-placeholder.jpg')}  alt="Product"/>
                    ))) : null}

                    {imageSourceUrls.length > 0 && !isPendingImages && imageSourceUrls.map((imageUrl:string, index:number) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Product`}
                            className={`product-image-slider-small-image${index === currentImageIndex ? '-selected' : ''}`}
                            onClick={() => handleImageClick(imageUrl)}
                            onMouseEnter={() => handleImageHover(index)}
                        />
                    )
                )}
                </div>}
                <button className = "product-image-slider-navigation-button" onClick={() => handleImageHover(currentImageIndex + 1)}>&gt;</button>
            </div>
            <CustomPopup show={isPopupVisible} onClose={() => setIsPopupVisible(false)}>
                <img
                    src={enlargedImageUrl}
                    alt={`Product`}
                    id="product-image-slider-enlarged-image"
                />
            </CustomPopup>
        </div>
    )

}

export default ProductImageSlider;