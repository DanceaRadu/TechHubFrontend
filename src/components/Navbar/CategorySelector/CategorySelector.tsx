import './CategorySelector.css'
import {useEffect, useState} from "react";
import ProductCategory from "../../../models/ProductCategory";
import {useNavigate} from "react-router-dom";

function CategorySelector() {

    const [fetchError, setFetchError] = useState<boolean>(false);
    const [isFetchPending, setIsFetchPending] = useState<boolean>(true);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const navigate = useNavigate();

    useEffect(() => {

        fetch("http://localhost:8080/api/v1/category/all")
            .then(response => {
                // Check if the response status is OK
                if (response.ok) {
                    return response.json();
                } else {
                    // Handle non-successful response
                    throw new Error('Request failed with status: ' + response.status);
                }
            })
            .then(data => {
                setCategories(data);
                console.log(data);
                setIsFetchPending(false);
            })
            .catch(() => {
                setIsFetchPending(false);
                setFetchError(true);
            });
    }, [])


    return (
        <div id="category-selector-outer-div">
            <div id="category-selector-div">
                {categories.map((item, index) => (
                    <div key={index} className="category-selector-category" onClick={() =>  navigate("/browse/" + item.categoryID + "/order/filters/1/d")}>
                        {item.categoryName}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategorySelector;