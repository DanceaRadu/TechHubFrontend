import './AddProductPage.css'
import React, {useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";
import Product from "../../../models/Product";
import ProductImage from "../../../models/ProductImage";
import ProductDTO from "../../../models/ProductDTO";
import {useNavigate} from "react-router-dom";

function AddProductPage() {

    const [isNameFieldFocused, setIsNameFieldFocused] = useState<boolean>(false);

    const [productName, setProductName] = useState<string>("");
    const [productPrice, setProductPrice] = useState<number>(0);
    const [productStock, setProductStock] = useState<number>(0);
    const [productDescription, setProductDescription] = useState<string>("");

    const [isPendingAdd, setIsPendingAdd] = useState<boolean>(false);
    const [selectedImages, setSelectedImages] = useState<any>([]);
    const navigate = useNavigate();

    function handleAddProduct(e:any) {

        e.preventDefault();
        setIsPendingAdd(true);
        let p:ProductDTO = new ProductDTO(productName, productPrice, productDescription, productStock);
        console.log(JSON.stringify(p))

        fetch("http://localhost:8080/api/v1/product",
            {
                method: 'POST',
                headers: {
                    "Origin": "http://localhost:8080:3000",
                    "Authorization": "Bearer " + Cookies.get('jwtToken'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(p)
            })
            .then(response => {
                if (!response.ok) {
                    setIsPendingAdd(false);
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Product created:', data);
                let fetchPromises = [];
                for(let i = 0; i < selectedImages.length; i++) {
                    const formData = new FormData();
                    formData.append('productID', data);
                    formData.append('image', selectedImages[i]);
                    fetchPromises.push(
                        fetch("http://localhost:8080/api/v1/product/image", {
                            method: 'POST',
                            headers: {
                                "Origin": "http://localhost:8080:3000",
                                "Authorization": "Bearer " + Cookies.get('jwtToken')
                            },
                            body: formData
                        })
                            .then(res => {

                            })
                            .catch(() => {

                            })
                    );
                }
                Promise.all(fetchPromises)
                    .then(() => {
                        setIsPendingAdd(false);
                        navigate(-1);
                    });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function handleNameChange(e:any) {
        setProductName(e.target.value);
    }

    function handlePriceChange(e:any) {
        setProductPrice(e.target.value);
    }

    function handleStockChange(e:any) {
        setProductStock(e.target.value);
    }

    function handleDescriptionChange(e:any) {
        setProductDescription(e.target.value);
    }

    // @ts-ignore
    return (
      <div id="add-product-page-main-div">
          <div id="add-product-page-inner-div">
              <div id="add-product-page-title">Add product</div>
              <form onSubmit={handleAddProduct}>
                  <div id="add-product-page-name-outer-div" style={{border: isNameFieldFocused ? '2px solid #730075' : '2px solid #AAAAAA'}}>
                      <div>Name</div>
                      <input
                          type="text"
                          id="add-product-page-name-input"
                          onFocus={() => setIsNameFieldFocused(true)}
                          onBlur={() => setIsNameFieldFocused(false)}
                          onChange={handleNameChange}
                      />
                  </div>
                  <div id="add-product-price-stock-div">
                      <div id="add-product-price-div">
                          <div id="add-product-page-price-label">Price [USD]: </div>
                          <input
                              type="number" min={0} max={2000000000}
                              id="add-product-page-price-input"
                              onChange={handlePriceChange}
                          />
                          <div>Error div</div>
                      </div>
                      <div id="add-product-stock-div">
                          <div id="add-product-page-stock-label">In stock:</div>
                          <input
                              type="number" min={0} max={2000000000}
                              id="add-product-page-stock-input"
                              onChange={handleStockChange}
                          />
                          <div>Error div</div>
                      </div>
                  </div>
                  <div id="add-product-page-description-label">Description (max 2000 chars)</div>
                  <textarea id="add-product-page-description-text-area" maxLength={2000} onChange={handleDescriptionChange}></textarea>
                  <div id="add-product-images-label">Select product images:</div>

                  {/*This is where the image selection starts*/}
                  <label htmlFor="add-product-page-images-input" id="add-product-page-images-input-label">
                      <span className="material-symbols-outlined" style={{fontSize:35}}>upload</span>
                  </label>
                  <input type="file" multiple
                         id="add-product-page-images-input"
                         name = "productImages"
                         onChange={(event) => {
                             const files = event.target.files;
                             if(files && files.length > 0)
                                { // @ts-ignore
                                    setSelectedImages(files);
                                    console.log(files);
                                }
                         }}/>
                  {selectedImages && (
                      <div id="add-product-page-images-div">
                          { Array.from(selectedImages).map((file:any, index:any) => (
                                  <img key = {index}
                                      className="add-product-page-image"
                                      alt="not found"
                                      width={"250px"}
                                      src={URL.createObjectURL(file)}
                                  />
                          ))}
                      </div>
                  )}
                  <button className={"cover-button"} id="add-product-page-submit-button">Add product</button>
                  {isPendingAdd &&
                      <div className="lds-roller">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                      </div>}
              </form>
          </div>
      </div>
    );
}

export default AddProductPage;