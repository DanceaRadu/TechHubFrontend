import './Navbar.css'
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import UserButton from "./UserButton/UserButton";
import ShoppingCartButton from "./ShoppingCartButton/ShoppingCartButton";
import CategorySelector from "./CategorySelector/CategorySelector";
function Navbar(props: any) {

    let isLoggedIn:boolean = props.isLoggedIn;
    let isPendingLoggedIn:boolean = props.isPendingLoggedIn;
    const [isSearchBarFocused, setIsSearchBarFocused] = useState<boolean>(false);
    const [navbarSearchValue, setNavbarSearchValue] = useState<string>("");

    const navigate = useNavigate();
    const handleSearchBarFocus = () => {
        setIsSearchBarFocused(true);
    }

    const handleSearchBarBlur = () => {
        setIsSearchBarFocused(false);
    }

    function navbarSearch(e:any) {
        e.preventDefault();
        navigate("/browse/cc0ef8af-8386-4dac-8526-97f2e997de9f/ascending/none/1/" + navbarSearchValue);
    }

    return (
      <div id="navbar-div">
          <div id = "navbar-logo-div">
              <div id="navbar-category-outer-div">
                  <span className="material-symbols-outlined" id="navbar-category-icon">list</span>
                  <div id="navbar-category-selector-div">
                      <CategorySelector></CategorySelector>
                  </div>
              </div>
              <Link to='/' onClick={() => {
                  navigate("/")
                  window.location.reload();
              }}>
                    <h1>
                        <span style={{color: '#ebf1ff'}}>Tech</span>
                        <span style={{color: 'purple'}}>Hub</span>
                    </h1>
              </Link>
          </div>
          <form id="navbar-search-form" style={{border: isSearchBarFocused ? '2px solid #730075' : '2px solid #AAAAAA'}} onSubmit={navbarSearch}>
              <input
                  type = "text"
                  placeholder="Search for a product"
                  id="navbar-search-field"
                  onFocus={handleSearchBarFocus}
                  onBlur={handleSearchBarBlur}
                  value = {navbarSearchValue}
                  onChange={(e) => setNavbarSearchValue(e.target.value)}
              />
              <span className="material-symbols-outlined" id="navbar-search-icon" onClick={navbarSearch}>search</span>
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