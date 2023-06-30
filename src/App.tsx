import React from 'react';
import './App.css';
import './components/LoginPage/LoginPage'
import LoginPage from "./components/LoginPage/LoginPage";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./components/Home/Home";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path = "/" element={<Home/>}/>

                <Route path = "/login" element={<LoginPage/>}/>

            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
