import React from 'react';
import './App.css';
import './components/LoginPage/LoginPage'
import LoginPage from "./components/LoginPage/LoginPage";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./components/Home/Home";
import useCheckLoggedIn from "./hooks/useCheckLoggedIn";
import useFetchShoppingCartProducts from "./hooks/useFetchShoppingCartProducts";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import EmailTokenPage from "./components/EmailTokenPage/EmailTokenPage";

function App() {

    const {isLoggedIn, isPending: isPendingLoggedIn} = useCheckLoggedIn();
    const {shoppingCartEntries, isPending, error, setShoppingCartEntries} = useFetchShoppingCartProducts(isLoggedIn);

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path = "/" element={<Home
                    isLoggedIn = {isLoggedIn}
                    shoppingCartEntries = {shoppingCartEntries}
                    setShoppingCartEntries = {setShoppingCartEntries}
                    isPendingLoggedIn = {isPendingLoggedIn}
                />}/>
                <Route path = "/login" element={<LoginPage
                    shoppingCartEntries = {shoppingCartEntries}
                    setShoppingCartEntries = {setShoppingCartEntries}
                />}/>
                <Route path="/signup" element={<RegistrationPage
                    shoppingCartEntries = {shoppingCartEntries}
                    setShoppingCartEntries = {setShoppingCartEntries}
                />}/>
                <Route path = "/verifymail/:token" element={
                   <EmailTokenPage/>
                }/>

            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
