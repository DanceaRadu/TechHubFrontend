import './ProductBrowser.css'
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import {useParams} from "react-router-dom";
import ProductGrid from "../ProductGrid/ProductGrid";
import React from "react";
import Navbar from "../Navbar/Navbar";
import useFetchUserFavorites from "../../hooks/useFetchUserFavorites";
import ProductFilter from './ProductFilter/ProductFilter';

function ProductBrowser(props:any) {

    const {isLoggedIn, isPending: isPendingLoggedIn} = useCheckLoggedIn();
    const {favorites, setFavorites, error: errorFavorites, isPending: isPendingFavorites} = useFetchUserFavorites(isLoggedIn);

    const {category} = useParams();
    const {order} = useParams();
    const {filters} = useParams();
    const {query} = useParams();
    const {pageNumber} = useParams();

    return (
      <div className = "background-div">
          <Navbar
              isLoggedIn={isLoggedIn}
              isPendingLoggedIn={isPendingLoggedIn}
              shoppingCartEntries={props.shoppingCartEntries}
              setShoppingCartEntries = {props.setShoppingCartEntries}>
          </Navbar>
          {category !== undefined && order !== undefined && filters !== undefined && pageNumber !== undefined && <div id="product-browser-div">
              <div id="product-browser-sorting-div">
                  <ProductFilter
                      category = {category}
                      order = {order}
                      filters = {filters}
                      query = {query}
                      pageNumber = {pageNumber}>
                  </ProductFilter>
              </div>
              <ProductGrid
                  isLoggedIn = {isLoggedIn}
                  shoppingCartEntries={props.shoppingCartEntries}
                  setShoppingCartEntries = {props.setShoppingCartEntries}
                  category = {category}
                  order = {order}
                  filters = {filters}
                  query = {query}
                  pageNumber = {pageNumber}
                  favorites = {favorites}
                  setFavorites = {setFavorites}>
              </ProductGrid>
          </div>}
      </div>
    );

}

export default ProductBrowser;