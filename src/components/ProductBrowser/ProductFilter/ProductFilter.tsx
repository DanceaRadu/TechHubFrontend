import './ProductFilter.css'
import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import IntervalSelector from "../../FormComponents/IntervalSelector/IntervalSelector";

function SorterElement(props: any) {
    const [isContentHidden, setIsContentHidden] = useState<boolean>(true);
    const optionList: string[] = props.optionList;
    const [selectedOption, setSelectedOption] = useState<string>(props.optionList[0]);

    let selectedSortOptionIndex = props.selectedSortOptionIndex;
    let setSelectedSortOptionIndex = props.setSelectedSortOptionIndex

    const {order} = useParams();

    const sorterElementRef = useRef<any>(null);

    useEffect(() => {
        optionList.forEach((option, index) => {
            if(option === order) {
                setSelectedOption(optionList[index]);
                setSelectedSortOptionIndex(index);
                setIsContentHidden(true);
            }
        })
    }, []);

    function handleChangeSortingOption(index: number) {
        setSelectedOption(optionList[index]);
        setSelectedSortOptionIndex(index);
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
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    let currentMinimum = props.currentMinimum;
    let setCurrentMinimum = props.setCurrentMinimum;
    let currentMaximum = props.currentMaximum;
    let setCurrentMaximum = props.setCurrentMaximum;

    const [showedVisualMinimum, setShowedVisualMinimum] = useState<number>(0);
    const [showedVisualMaximum, setShowedVisualMaximum] = useState<number>(10000);

    function handleSelectInterval(index:number) {
        if(selectedOption === index) {
            setSelectedOption(null);
            setCurrentMinimum(0);
            setCurrentMaximum(10000);
        }
        else {
            setCurrentMinimum(options[index][0]);
            setCurrentMaximum(options[index][1]);
            setSelectedOption(index);
        }
    }

    function handleMinInputChange(e:any) {
        setSelectedOption(null);
        let num = parseInt(e.target.value);
        setShowedVisualMinimum(NaN);
        if(num >= 0) {
            setShowedVisualMinimum(num);
        }
    }

    function handleMaxInputChange(e:any) {
        setSelectedOption(null);
        let num = parseInt(e.target.value);
        setShowedVisualMaximum(NaN);
        if(num >= 0) setShowedVisualMaximum(num);

    }

    useEffect(() => {
        if(!isNaN(showedVisualMinimum) && showedVisualMinimum >= 0 && showedVisualMinimum <= 10000 && showedVisualMinimum <= showedVisualMaximum) setCurrentMinimum(showedVisualMinimum);
        if(!isNaN(showedVisualMaximum) && showedVisualMaximum >= 0 && showedVisualMaximum <= 10000  && showedVisualMinimum <= showedVisualMaximum) setCurrentMaximum(showedVisualMaximum);
    }, [showedVisualMinimum, showedVisualMaximum]);

    useEffect(() => {
        setShowedVisualMaximum(currentMaximum);
        setShowedVisualMinimum(currentMinimum);
    }, [currentMinimum, currentMaximum]);

    return (
      <div id="product-sorter-price-element-outer-div">
        <p style={{fontSize:20, marginBottom:5}}> Price</p>
          {options.map((option, index) => (
              <div key={index} id="product-filter-price-element-div">
                  <input
                      type="checkbox"
                      className="purple-checkbox"
                      checked = {selectedOption === index}
                      onChange={() => handleSelectInterval(index)}
                  />
                  <span className="product-filter-price-price-span">{option[0] + " - " + option[1]} </span>
              </div>
          ))}
          <div id="product-sorter-price-element-input-div">
              <input
                  type="number"
                  value={isNaN(showedVisualMinimum) ? '' : showedVisualMinimum}
                  onChange={(e) => handleMinInputChange(e)}
                  onBlur={(e) => {
                      if(isNaN(showedVisualMinimum) || showedVisualMinimum > 10000) {
                          setShowedVisualMinimum(0);
                          return;
                      }
                      if(parseInt(e.target.value) >= showedVisualMaximum) setShowedVisualMaximum(parseInt(e.target.value));
                  }}
              />
              <span style={{fontSize:22}}>-</span>
              <input
                  type="number"
                  value={isNaN(showedVisualMaximum) ? '' : showedVisualMaximum}
                  onChange={(e) => handleMaxInputChange(e)}
                  onBlur={(e) => {
                      if(isNaN(showedVisualMaximum) || showedVisualMaximum > 10000) {
                          setShowedVisualMaximum(10000);
                          return;
                      }
                      if(parseInt(e.target.value) <= showedVisualMinimum) setShowedVisualMinimum(parseInt(e.target.value));

                  }}
              />
          </div>
          <IntervalSelector
            maxValue = {10000}
            minValue = {0}
            currentMinValue = {currentMinimum}
            setCurrentMinValue = {setCurrentMinimum}
            currentMaxValue = {currentMaximum}
            setCurrentMaxValue = {setCurrentMaximum}
            setSelectedOption  = {setSelectedOption}
          ></IntervalSelector>
      </div>
    );
}

function ProductFilter(props:any) {

    let category = props.category;
    let order = props.order;
    let filters = props.filters
    let query = props.query;
    let pageNumber = props.pageNumber;

    const navigate = useNavigate();
    const [selectedSortOptionIndex, setSelectedSortOptionIndex] = useState<number>(0);

    const [currentMinimum, setCurrentMinimum] = useState<number>(0);
    const [currentMaximum, setCurrentMaximum] = useState<number>(10000);

    function handleApplyFilters() {

        let filterObject = {
            priceLow: currentMinimum,
            priceHigh: currentMaximum
        }

        if(query !== undefined) navigate(`/browse/${category}/${sortOptionList[selectedSortOptionIndex]}/${JSON.stringify(filterObject)}/1/${query}`)
        else navigate(`/browse/${category}/${sortOptionList[selectedSortOptionIndex]}/${JSON.stringify(filterObject)}/1`);
    }

    let sortOptionList = ["Featured", "Price asc" , "Price desc", "Rating", "No. of reviews", "A-Z"];

    useEffect(() => {
        if(filters === "none") return;
        let filterObject = JSON.parse(filters);
        setCurrentMaximum(filterObject.priceHigh);
        setCurrentMinimum(filterObject.priceLow);
    }, [filters]);

    return (
        <div id="product-filter-outer-div">
            <SorterElement
                optionList = {sortOptionList}
                selectedSortOptionIndex = {selectedSortOptionIndex}
                setSelectedSortOptionIndex = {setSelectedSortOptionIndex}
            ></SorterElement>
            <hr style={{border:"1px solid #333"}}/>
            <PriceElement optionList = {[
                [0, 200],
                [200, 500],
                [500, 1000],
                [1000, 2000],
                [2000, 3000],
                [3000, 4000],
                [4000, 5000],
                [5000, 10000]]}
                currentMinimum = {currentMinimum}
                setCurrentMinimum = {setCurrentMinimum}
                currentMaximum = {currentMaximum}
                setCurrentMaximum = {setCurrentMaximum}
            >
            </PriceElement>
            <hr style={{border:"1px solid #333"}}/>
            <button id="product-filter-apply-button" onClick={handleApplyFilters}>Apply filters</button>
        </div>
    );
}

export default ProductFilter;