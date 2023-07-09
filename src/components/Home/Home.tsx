import React from "react";
import Navbar from "../Navbar/Navbar";
import './Home.css'
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";

function Home() {

    const {isLoggedIn, isPending: isPendingLoggedIn} = useCheckLoggedIn();

    return(
        <div className="background-div">
            <Navbar isLoggedIn={isLoggedIn} isPendingLoggedIn={isPendingLoggedIn}></Navbar>
        </div>
    );
}

export default Home;