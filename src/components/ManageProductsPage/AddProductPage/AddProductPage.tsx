import './AddProductPage.css'
import React, {useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";
import ProductDTO from "../../../models/ProductDTO";
import {useNavigate} from "react-router-dom";
import config from "../../../config";

function AddProductPage() {

    const [isNameFieldFocused, setIsNameFieldFocused] = useState<boolean>(false);

    const [productName, setProductName] = useState<string>("");
    const [productPrice, setProductPrice] = useState<number>(0);
    const [productStock, setProductStock] = useState<number>(0);
    const [productDescription, setProductDescription] = useState<string>("");

    const [isPendingAdd, setIsPendingAdd] = useState<boolean>(false);
    const [addError, setAddError] = useState<string>("");

    const [priceErrorMessage, setPriceErrorMessage] = useState<string>("T");
    const [stockErrorMessage, setStockErrorMessage] = useState<string>("T");
    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState<string>("T");
    const [nameErrorMessage, setNameErrorMessage] = useState<string>("T");

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);

    const [specDivs, setSpecDivs] = useState<SpecDiv[]>([]);
    const [specGlobalID, setSpecGlobalID] = useState<number>(0);
    const [specErrorMessage, setSpecErrorMessage] = useState<string>("T");

    const [selectedImages, setSelectedImages] = useState<any>([]);
    const navigate = useNavigate();

    interface SpecDiv {
        id:number,
        key:string,
        value:string
    }

    function handleAddProduct(e:any) {

        e.preventDefault();
        setIsPendingAdd(true);
        setAddError("");
        setIsSubmitButtonDisabled(true);
        let ok:boolean = true;

        setPriceErrorMessage("T");
        setStockErrorMessage("T");
        setDescriptionErrorMessage("T");
        setNameErrorMessage("T")
        setSpecErrorMessage("T")

        if(productName === "") {
            setNameErrorMessage("Name cannot pe empty!");
            ok = false;
        }

        // @ts-ignore
        if(productPrice === 0 || productPrice === undefined || productPrice === "") {
            setPriceErrorMessage("Price is empty!");
            ok = false;
        }
        // @ts-ignore
        if(productStock === 0 || productPrice === undefined || productPrice === "") {
            setStockErrorMessage("Stock is empty!");
            ok = false;
        }

        if(productPrice < 0) {
            setPriceErrorMessage("Price is negative!");
            ok = false;
        }
        if(productStock < 0) {
            setStockErrorMessage("Stock is negative!");
            ok = false;
        }

        if(productPrice > 2000000000) {
            setPriceErrorMessage("Price is too big!");
            ok = false;
        }

        if(productStock > 2000000000) {
            setStockErrorMessage("Stock is too big!");
            ok = false;
        }

        if(productDescription === "") {
            setDescriptionErrorMessage("Description cannot be empty");
            ok = false;
        }

        if(selectedImages.length < 1) {
            setAddError("Must select at least one picture");
            ok = false;
        }

        specDivs.forEach((item:SpecDiv) => {
            if(item.key === '' || item.value === '') {
                setSpecErrorMessage("Every added spec must have a key-value pair");
                return;
            }
        });

        if(!ok) {
            setIsPendingAdd(false);
            setIsSubmitButtonDisabled(false);
            return;
        }

        let specObject:any = {};

        specDivs.forEach((item:SpecDiv) => {
            specObject[item.key] = item.value;
        });

        let p:ProductDTO = new ProductDTO(productName, productPrice, productDescription, productStock, JSON.stringify(specObject));

        fetch(config.apiUrl + "/product",
            {
                method: 'POST',
                headers: {
                    "Origin": config.origin,
                    "Authorization": "Bearer " + Cookies.get('jwtToken'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(p)
            })
            .then(response => {
                if (!response.ok) {
                    setIsPendingAdd(false);
                    setIsSubmitButtonDisabled(false);
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let fetchPromises = [];
                for(let i = 0; i < selectedImages.length; i++) {
                    const formData = new FormData();
                    formData.append('productID', data);
                    formData.append('image', selectedImages[i]);
                    fetchPromises.push(
                        fetch(config.apiUrl + "/product/image", {
                            method: 'POST',
                            headers: {
                                "Origin": config.origin,
                                "Authorization": "Bearer " + Cookies.get('jwtToken')
                            },
                            body: formData
                        })
                            .catch(() => {
                                setAddError("⚠Something went wrong. Please try again.");
                                setIsSubmitButtonDisabled(false);
                                setIsPendingAdd(false);
                            })
                    );
                }
                Promise.all(fetchPromises)
                    .then(() => {
                        setIsPendingAdd(false);
                        navigate(-1);})
                    .catch(() => {
                        setIsSubmitButtonDisabled(false);
                })
            })
            .catch(() => {
                setIsSubmitButtonDisabled(false);
                setAddError("Something went wrong. Please try again.");
                setIsPendingAdd(false);
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

    function handleKeyChange(event:any, id:number) {
        const updatedDivs = specDivs.map((div) => {
            if (div.id === id) {
                return { ...div, key: event.target.value };
            }
            return div;
        });
        setSpecDivs(updatedDivs);
    }

    function handleValueChange(event:any, id:number) {
        const updatedDivs = specDivs.map((div) => {
            if (div.id === id) {
                return { ...div, value: event.target.value };
            }
            return div;
        });
        setSpecDivs(updatedDivs);
    }

    function handleAddSpec() {
        const newId = specGlobalID;
        setSpecGlobalID(specGlobalID + 1);
        const newDiv = { id: newId, key: '', value:''};
        setSpecDivs([...specDivs, newDiv]);
    }

    function handleDeleteSpec(id:number) {
        const updatedDivs = specDivs.filter((div) => div.id !== id);
        setSpecDivs(updatedDivs);
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
                  <div className={nameErrorMessage === "T" ? "error-inactive" : "error-active"}>{nameErrorMessage}</div>
                  <div id="add-product-price-stock-div">
                      <div id="add-product-price-div">
                          <div id="add-product-page-price-label">Price [USD]: </div>
                          <input
                              type="number" min={0} max={2000000000}
                              step={0.01}
                              id="add-product-page-price-input"
                              onChange={handlePriceChange}
                          />
                          <div className={priceErrorMessage === "T" ? "error-inactive" : "error-active"}>{priceErrorMessage}</div>
                      </div>
                      <div id="add-product-stock-div">
                          <div id="add-product-page-stock-label">In stock:</div>
                          <input
                              type="number" min={1} max={2000000000}
                              id="add-product-page-stock-input"
                              onChange={handleStockChange}
                          />
                          <div className={stockErrorMessage === "T" ? "error-inactive" : "error-active"}>{stockErrorMessage}</div>
                      </div>
                  </div>
                  <div id="add-product-page-description-label">Description (max 2000 chars)</div>
                  <textarea id="add-product-page-description-text-area" maxLength={2000} onChange={handleDescriptionChange}></textarea>
                  <div className={descriptionErrorMessage === "T" ? "error-inactive" : "error-active"}>{descriptionErrorMessage}</div>

                  {/*Adding specs*/}
                  <div id="add-product-page-specs-outer-div">
                      <button id="add-product-page-add-spec-button" type="button" onClick={handleAddSpec}><span className="material-symbols-outlined" id="add-product-page-add-spec-icon">add</span>Add spec</button>
                      {specDivs.map((div:any) => (
                          <div key={div.id} className="add-product-page-outer-spec-div">
                              <input
                                  className="add-product-page-outer-spec-key-input"
                                  type="text"
                                  value={div.key}
                                  onChange={(event) => handleKeyChange(event, div.id)}
                                  placeholder="key"
                              />
                              <input
                                  className="add-product-page-outer-spec-value-input"
                                  type="text"
                                  value={div.value}
                                  onChange={(event) => handleValueChange(event, div.id)}
                                  placeholder="value"
                              />
                              <button type="button" className="add-product-page-outer-spec-delete-button" onClick={() => handleDeleteSpec(div.id)}>Delete</button>
                          </div>
                      ))}
                      <div className={specErrorMessage === "T" ? "error-inactive" : "error-active"} style={{width:"100%"}}>{specErrorMessage}</div>
                  </div>

                  {/*This is where the image selection starts*/}
                  <div id="add-product-images-label">Select product images:</div>
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
                  <button className={"cover-button"} id="add-product-page-submit-button" disabled={isSubmitButtonDisabled}>Add product</button>
                  {addError && <div id="add-product-error-div">{addError}</div>}
                  {isPendingAdd &&
                      <div id="lds-roller-outer-div">
                          <div className="lds-roller">
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                          </div>
                      </div>
                  }
              </form>
          </div>
      </div>
    );
}

export default AddProductPage;