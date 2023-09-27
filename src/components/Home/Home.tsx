import React from "react";
import Navbar from "../Navbar/Navbar";
import './Home.css'
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import ProductGrid from "../ProductGrid/ProductGrid";

function Home(props:any) {

    const {isLoggedIn, isPending: isPendingLoggedIn} = useCheckLoggedIn();

    return(
        <div className="background-div">
            <Navbar
                isLoggedIn={isLoggedIn}
                isPendingLoggedIn={isPendingLoggedIn}
                shoppingCartEntries={props.shoppingCartEntries}
                setShoppingCartEntries = {props.setShoppingCartEntries}>
            </Navbar>
            <div id="home-content-div">
                <div id="home-sorting-div"></div>
                <ProductGrid
                    isLoggedIn = {isLoggedIn}
                    shoppingCartEntries={props.shoppingCartEntries}
                    setShoppingCartEntries = {props.setShoppingCartEntries}>
                </ProductGrid>
            </div>

        </div>
    );
}

export default Home;