import React from "react";
import Navbar from "../Navbar/Navbar";
import './Home.css'
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import ProductGrid from "../ProductGrid/ProductGrid";
import {useParams} from "react-router-dom";

function Home(props:any) {

    const {isLoggedIn, isPending: isPendingLoggedIn} = useCheckLoggedIn();

    const {category} = useParams();
    const {order} = useParams();
    const {filters} = useParams();
    const {query} = useParams();
    const {pageNumber} = useParams();

    return(
        <div className="background-div">
            <Navbar
                isLoggedIn={isLoggedIn}
                isPendingLoggedIn={isPendingLoggedIn}
                shoppingCartEntries={props.shoppingCartEntries}
                setShoppingCartEntries = {props.setShoppingCartEntries}>
            </Navbar>
            <div id="home-content-div">
                {category !== undefined && order !== undefined && filters !== undefined && pageNumber !== undefined && <div id="product-browser-div">
                    <div id="home-sorting-div"></div>
                    <ProductGrid
                        isLoggedIn = {isLoggedIn}
                        shoppingCartEntries={props.shoppingCartEntries}
                        setShoppingCartEntries = {props.setShoppingCartEntries}
                        category = {category}
                        order = {order}
                        filters = {filters}
                        query = {query}
                        pageNumber = {pageNumber}
                    >
                    </ProductGrid>
                </div>}
                {(category === undefined || order === undefined || filters === undefined || pageNumber === undefined) && <div>
                    This is the home
                </div>}
            </div>

        </div>
    );
}

export default Home;