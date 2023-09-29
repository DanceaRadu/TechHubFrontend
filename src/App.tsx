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
import AccountPage from "./components/AccountPage/AccountPage";

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
                <Route path="/account" element={<AccountPage
                    shoppingCartEntries = {shoppingCartEntries}
                    setShoppingCartEntries = {setShoppingCartEntries}
                    isPendingLoggedIn = {isPendingLoggedIn}
                    isLoggedIn = {isLoggedIn}
                    selectedCategory = {[true,false,false,false,false,false]}
                />}/>
                <Route path="/account/orders" element={<AccountPage
                    shoppingCartEntries = {shoppingCartEntries}
                    setShoppingCartEntries = {setShoppingCartEntries}
                    isPendingLoggedIn = {isPendingLoggedIn}
                    isLoggedIn = {isLoggedIn}
                    selectedCategory = {[true,false,false,false,false,false]}
                />}>
                </Route>
                <Route path="/account/favorites" element={<AccountPage
                    shoppingCartEntries = {shoppingCartEntries}
                    setShoppingCartEntries = {setShoppingCartEntries}
                    isPendingLoggedIn = {isPendingLoggedIn}
                    isLoggedIn = {isLoggedIn}
                    selectedCategory = {[false,true,false,false,false,false]}
                />}>
                </Route>
                <Route path="/account/reviews" element={<AccountPage
                    shoppingCartEntries = {shoppingCartEntries}
                    setShoppingCartEntries = {setShoppingCartEntries}
                    isPendingLoggedIn = {isPendingLoggedIn}
                    isLoggedIn = {isLoggedIn}
                    selectedCategory = {[false,false,true,false,false,false]}
                />}>
                </Route>
                <Route path="/account/cards" element={<AccountPage
                    shoppingCartEntries = {shoppingCartEntries}
                    setShoppingCartEntries = {setShoppingCartEntries}
                    isPendingLoggedIn = {isPendingLoggedIn}
                    isLoggedIn = {isLoggedIn}
                    selectedCategory = {[false,false,false,true,false,false]}
                />}>
                </Route>
                <Route path="/account/addresses" element={<AccountPage
                    shoppingCartEntries = {shoppingCartEntries}
                    setShoppingCartEntries = {setShoppingCartEntries}
                    isPendingLoggedIn = {isPendingLoggedIn}
                    isLoggedIn = {isLoggedIn}
                    selectedCategory = {[false,false,false,false,true,false]}
                />}>
                </Route>
                <Route path="/account/manage/:pageNumber" element={<AccountPage
                    shoppingCartEntries = {shoppingCartEntries}
                    setShoppingCartEntries = {setShoppingCartEntries}
                    isPendingLoggedIn = {isPendingLoggedIn}
                    isLoggedIn = {isLoggedIn}
                    selectedCategory = {[false,false,false,false,false,true]}
                />}>
                </Route>

                <Route path = "/verifymail/:token" element={
                   <EmailTokenPage/>
                }/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
