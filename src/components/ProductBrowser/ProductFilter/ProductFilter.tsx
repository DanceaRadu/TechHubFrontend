import './ProductFilter.css'
import React, {useEffect, useRef, useState} from "react";

function SorterElement(props: any) {
    const [isContentHidden, setIsContentHidden] = useState<boolean>(false);
    const optionList: string[] = props.optionList;
    const [selectedOption, setSelectedOption] = useState<string>(props.optionList[0]);

    const sorterElementRef = useRef<any>(null);

    function handleChangeSortingOption(index: number) {
        setSelectedOption(optionList[index]);
        setIsContentHidden(true);
    }

    useEffect(() => {
        // This function will handle clicks outside the SorterElement component
        function handleClickOutside(event: MouseEvent) {
            if (sorterElementRef.current && !sorterElementRef.current.contains(event.target as Node)) {
                setIsContentHidden(true);
            }
        }
        // Add a click event listener to the document body
        document.addEventListener('click', handleClickOutside);
        // Cleanup the event listener when the component is unmounted
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="product-filter-dropdown-outer-div" ref={sorterElementRef}>
            <span>Sort by</span>
            <div className="product-filter-dropdown" onClick={() => setIsContentHidden(!isContentHidden)}>
                <span className="product-filter-dropdown-span">{selectedOption}</span>
                <span className={"material-symbols-outlined " + (isContentHidden ? "" : "arrow-rotated")} id="product-sorter-arrow-icon">expand_more</span>
            </div>
            <div className={"product-filter-dropdown-content " + (isContentHidden ? "display-none" : "display-block")}>
                {optionList.map((option: string, index: number) => (
                    <p key={index} className="product-sorter-option" onClick={() => handleChangeSortingOption(index)}>{option}</p>
                ))}
            </div>
        </div>
    );
}

function PriceElement(props:any) {

    const options:[number,number][] = props.optionList;

    return (
      <div id="product-sorter-price-element-outer-div">
        <p style={{fontSize:20, marginBottom:5}}> Price</p>
          {options.map((option, index) => (
              <div key={index} id="product-filter-price-element-div">
                  <input type="checkbox" className="purple-checkbox"/>
                  <span className="product-filter-price-price-span">{option[0] + " - " + option[1]} </span>
              </div>
          ))}
      </div>
    );
}

function ProductFilter() {
    return (
        <div id="product-filter-outer-div">
            <SorterElement optionList = {["Price asc" , "Price desc", "Rating", "No. of reviews"]}></SorterElement>
            <hr style={{border:"1px solid #333"}}/>
            <PriceElement optionList = {[
                [0, 200],
                [200, 500],
                [500, 1000],
                [1000, 2000],
                [2000, 3000],
                [3000, 4000],
                [4000, 5000],
                [5000, 10000]]}>
            </PriceElement>
            <hr style={{border:"1px solid #333"}}/>
        </div>
    );
}

export default ProductFilter;