import './Navbar.css'
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import UserButton from "./UserButton/UserButton";
import ShoppingCartButton from "./ShoppingCartButton/ShoppingCartButton";
function Navbar(props: any) {

    let isLoggedIn:boolean = props.isLoggedIn;
    let isPendingLoggedIn:boolean = props.isPendingLoggedIn;
    const [isSearchBarFocused, setIsSearchBarFocused] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleSearchBarFocus = () => {
        setIsSearchBarFocused(true);
    }

    const handleSearchBarBlur = () => {
        setIsSearchBarFocused(false);
    }

    return (
      <div id="navbar-div">
          <Link to='/' onClick={() => {
              navigate("/")
              window.location.reload();
          }}>
                <h1>
                    <span style={{color: '#ebf1ff'}}>Tech</span>
                    <span style={{color: 'purple'}}>Hub</span>
                </h1>
          </Link>
          <form id="navbar-search-form" style={{border: isSearchBarFocused ? '2px solid #730075' : '2px solid #AAAAAA'}}>
              <input type = "text" placeholder="Search for a product" id="navbar-search-field" onFocus={handleSearchBarFocus} onBlur={handleSearchBarBlur}/>
              <span className="material-symbols-outlined" id="navbar-search-icon">search</span>
          </form>
          <div id="navbar-right-div">
              <ShoppingCartButton
                  isLoggedIn={isLoggedIn}
                  isPendingLoggedIn = {isPendingLoggedIn}
                  shoppingCartEntries = {props.shoppingCartEntries}
                  setShoppingCartEntries = {props.setShoppingCartEntries} >
              </ShoppingCartButton>
              <UserButton isLoggedIn={isLoggedIn} isPendingLoggedIn = {isPendingLoggedIn}></UserButton>
          </div>
      </div>
    );
}

export default Navbar;