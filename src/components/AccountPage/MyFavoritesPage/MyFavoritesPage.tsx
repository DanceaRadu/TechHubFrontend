import './MyFavoritesPage.css'
import useFetchUserFavorites from "../../../hooks/useFetchUserFavorites";
import useCheckLoggedIn from "../../../hooks/useCheckLoggedIn";
import React from "react";
import MyFavoriteEntry from "./MyFavoriteEntry/MyFavoriteEntry";
function MyFavoritesPage(props:any) {

    const {isLoggedIn, isPending: isPendingLoggedIn} = useCheckLoggedIn();
    const {favorites, setFavorites, error: errorFavorites, isPending: isPendingFavorites} = useFetchUserFavorites(isLoggedIn);

    return(
        <div id="my-favorites-page-outer-div">
            {isPendingFavorites && !errorFavorites &&
                <div className="lds-roller" id="my-favorites-page-loading-animation">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>}
            {errorFavorites && <p id="my-favorites-page-error-message">{errorFavorites}</p>}
            {!isPendingFavorites && !isPendingLoggedIn && !errorFavorites && <p id="my-favorites-page-header">{favorites.length > 0 ? "My favorites" : "You have no favorites"}</p>}
            {!isPendingFavorites && !isPendingLoggedIn && !errorFavorites && favorites.map((favoriteEntry:any, index:number) => (
                <div key={favoriteEntry.favoriteID}>
                    <MyFavoriteEntry
                        favoriteEntry = {favoriteEntry}
                        shoppingCartEntries={props.shoppingCartEntries}
                        setShoppingCartEntries = {props.setShoppingCartEntries}
                        isLoggedIn = {isLoggedIn}
                        favorites = {favorites}
                        setFavorites = {setFavorites}
                    >
                    </MyFavoriteEntry>
                    {(index+1) !== favoriteEntry.length && <hr style={{border: "1px solid #222"}}/>}
                </div>
            ))}
        </div>
    )

}

export default MyFavoritesPage