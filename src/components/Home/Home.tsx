import React from "react";
import Navbar from "../Navbar/Navbar";
import './Home.css'
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import ProductGrid from "../ProductGrid/ProductGrid";
import useFetchShoppingCartProducts from "../../hooks/useFetchShoppingCartProducts";

function Home() {

    const {isLoggedIn, isPending: isPendingLoggedIn} = useCheckLoggedIn();
    const {shoppingCartEntries, isPending, error, setShoppingCartEntries} = useFetchShoppingCartProducts(isLoggedIn);

    return(
        <div className="background-div">
            <Navbar
                isLoggedIn={isLoggedIn}
                isPendingLoggedIn={isPendingLoggedIn}
                shoppingCartEntries={shoppingCartEntries}
                setShoppingCartEntries = {setShoppingCartEntries}>
            </Navbar>
            <ProductGrid
                shoppingCartEntries={shoppingCartEntries}
                setShoppingCartEntries = {setShoppingCartEntries}>
            </ProductGrid>
        </div>
    );
}

export default Home;