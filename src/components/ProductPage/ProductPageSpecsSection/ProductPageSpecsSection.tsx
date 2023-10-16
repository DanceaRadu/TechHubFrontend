import './ProductPageSpecsSection.css'

function ProductPageSpecsSection(props:any) {

    const specs = props.specs === null ? "" : JSON.parse(props.specs);

    const keyList = Object.entries(specs).map(([key, value], index) => (
        <div key={key} className={index % 2 === 1 ? "spec-key odd" : "spec-key even"}>
            <span>{key}:</span>
        </div>
    ));

    const valueList = Object.entries(specs).map(([key, value], index) => (
        <div key={key} className={index % 2 === 1 ? "spec-value odd" : "spec-value even"}>
            <span >{String(value)}</span>
        </div>
    ));

    return (
      <div style={{width:"100%"}}>
          {props.specs !== null &&
              <div id = "product-page-specs-section-outer-div">
                  <div id="product-page-specs-section-key-div">
                      {keyList}
                  </div>
                  <div id="product-page-specs-section-value-div">
                      {valueList}
                  </div>
              </div>
          }
          {props.specs === null && <p>This product has no specs added.</p>}
      </div>
    );

}

export default ProductPageSpecsSection;