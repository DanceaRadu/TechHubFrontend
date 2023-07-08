import './Navbar.css'
import React from "react";
import {Link} from "react-router-dom";
import UserButton from "./UserButton/UserButton";
function Navbar() {

    return (
      <div id="navbar-div">
          <Link to='/' onClick={() => window.location.reload()}>
                <h1>
                    <span style={{color: '#ebf1ff'}}>Tech</span>
                    <span style={{color: 'purple'}}>Hub</span>
                </h1>
          </Link>
          <form id="navbar-search-form">
              <input type = "text" placeholder="Search for a product" id="navbar-search-field"/>
              <span className="material-symbols-outlined" id="navbar-search-icon">search</span>
          </form>
          <UserButton></UserButton>
      </div>
    );
}

export default Navbar;