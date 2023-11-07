import React from "react";
import Navbar from "../Navbar/Navbar";
import './Home.css'
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import FeaturedProductsGrid from "./FeaturedProductsGrid/FeaturedProductsGrid";

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
                <div id="home-content-inner-div">
                    <div className="parallax">
                        <span>
                            <h1><span style={{color: '#ebf1ff'}}>HELLO</span>
                            <span style={{color: 'purple'}}> THERE</span></h1>
                        </span>
                    </div>
                    <div id="home-content-featured-products-div">
                        <p id="home-content-featured-products-div-title">Featured products</p>
                        <FeaturedProductsGrid
                            isLoggedIn = {isLoggedIn}
                            shoppingCartEntries = {props.shoppingCartEntries}
                            setShoppingCartEntries = {props.setShoppingCartEntries}
                        ></FeaturedProductsGrid>
                        <br/>
                        <br/>
                        <p id="home-content-featured-products-div-title">Top rated products</p>
                        <FeaturedProductsGrid
                            isLoggedIn = {isLoggedIn}
                            shoppingCartEntries = {props.shoppingCartEntries}
                            setShoppingCartEntries = {props.setShoppingCartEntries}
                        ></FeaturedProductsGrid>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;