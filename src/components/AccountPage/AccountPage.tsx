import React, {useEffect, useState} from "react";
import './AccountPage.css'
import Navbar from "../Navbar/Navbar";
import {useNavigate} from 'react-router-dom';
import useFetchAccountInfo from "../../hooks/useFetchAccountInfo";
import useCheckLoggedIn from "../../hooks/useCheckLoggedIn";
import useFetchProfilePicture from "../../hooks/useFetchProfilePicture";
import ManageProductsPage from "../ManageProductsPage/ManageProductsPage";
import MyReviewsPage from "./MyReviewsPage/MyReviewsPage";
import MyFavoritesPage from "./MyFavoritesPage/MyFavoritesPage";
import CustomPopup from "../CustomPopup/CustomPopup";
import 'react-phone-number-input/style.css'
import PhoneInput, {formatPhoneNumberIntl} from 'react-phone-number-input'
import config from "../../config";
// @ts-ignore
import Cookies from "js-cookie";
function AccountPage(this: any, props:any) {

    const navigate = useNavigate();

    const {isLoggedIn, isPending} = useCheckLoggedIn();
    const {accountInfo, setAccountInfo} = useFetchAccountInfo(isLoggedIn);
    const {imageSourceUrl, error:imageError, isPending:isProfilePicturePending} = useFetchProfilePicture();

    const [navigationOptions, setNavigationOptions] = useState<boolean[]>([false,false,false,false,false,false])
    const [isPhoneNumberPopupVisible, setIsPhoneNumberPopupVisible] = useState<boolean>(false);
    const [isChangeProfilePicturePopupVisible,setIsChangeProfilePicturePopupVisible] = useState<boolean>();

    const [phoneValue, setPhoneValue] = useState<any>();
    const [isLoadingModifyPhoneNumber, setIsLoadingModifyPhoneNumber] = useState<boolean>(false);
    const [modifyPhoneNumberError, setModifyPhoneNumberError] = useState<string>("")

    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [selectedProfileImageError, setSelectedProfileImageError] = useState<string>("");
    const [isSetProfileImagePending, setIsProfileImagePending] = useState<boolean>(false);


    //if the user is not logged in, redirect them to the login page
    useEffect(() => {
        if(!isPending && !isLoggedIn) {
            navigate("/login");
        }
        setNavigationOptions(props.selectedCategory);
    }, [isPending, isLoggedIn, props.selectedCategory, navigationOptions, navigate]);

    function handleOrders() {
        navigate("/account/orders");
    }

    function handleFavorites() {
        navigate("/account/favorites");
    }

    function handleMyReviews() {
        navigate("/account/reviews");
    }

    function handleMyCreditCards() {
        navigate("/account/cards");
    }

    function handleMyAddresses() {
        navigate("/account/addresses");
    }
    function handleManageProducts() {
        navigate("/account/manage/1");
    }

    function handleChangePhoneNumber(e:any) {
        e.preventDefault();
        setModifyPhoneNumberError("");

        console.log(phoneValue);
        if(phoneValue === "" || phoneValue === undefined) {
            setModifyPhoneNumberError("Phone number cannot be empty.")
            return;
        }
        setIsLoadingModifyPhoneNumber(true);

        const patchData = [
            { op: 'replace', path: '/phoneNumber', value: phoneValue}
        ];

        fetch(config.apiUrl + "/user", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json',
                "Origin": config.origin,
                "Authorization": "Bearer " + Cookies.get('jwtToken')
            },
            body: JSON.stringify(patchData),
        })
            .then((response) => {
                //check for phone number conflict
                if (response.status === 409) throw new Error("User with this phone number already exists.");
                if(!response.ok) throw new Error("Something went wrong. Please try again.")
                setIsLoadingModifyPhoneNumber(false);
                setIsPhoneNumberPopupVisible(false);
                const updatedUser = {...accountInfo};
                updatedUser.phoneNumber = phoneValue;
                setAccountInfo(updatedUser);
            })
            .catch((e) => {
                setIsLoadingModifyPhoneNumber(false);
                setModifyPhoneNumberError(e.message);
            });
    }

    function handleChangeProfileImage() {
        const formData = new FormData();
        setSelectedProfileImageError("");

        if(selectedProfileImage === null) {
            setSelectedProfileImageError("You must select a picture");
            return;
        }
        formData.append('image', selectedProfileImage);
        setIsProfileImagePending(true);
        fetch(config.apiUrl + "/user/profilepicture", {
            method: 'POST',
            headers: {
                "Origin": config.origin,
                "Authorization": "Bearer " + Cookies.get('jwtToken')
            },
            body: formData
        })
            .then((response) => {
                if(!response.ok) throw new Error("Something went wrong.")
                setIsProfileImagePending(false);
                window.location.reload();
            })
            .catch((e) => {
                setSelectedProfileImageError(e.message);
                setIsProfileImagePending(false);
            })
    }

    function handleLogOut() {
        Cookies.remove("jwtToken");
        window.location.reload();
    }
    return (
        <div className = "background-div">
            <Navbar
                isLoggedIn={isLoggedIn}
                isPendingLoggedIn={isPending}
                shoppingCartEntries={props.shoppingCartEntries}
                setShoppingCartEntries = {props.setShoppingCartEntries}>
            </Navbar>
            <div id="account-container-div" className={(isPhoneNumberPopupVisible || isChangeProfilePicturePopupVisible) ? 'blurred' : ''}>
                <div id="account-info-outer-div">
                    <div id="account-info-div">
                        <div id ="account-page-image-container">
                            <span className="material-symbols-outlined" id="account-page-edit-photo-icon" onClick={() => setIsChangeProfilePicturePopupVisible(true)}>edit</span>
                            {(isProfilePicturePending || imageError) ? (
                                    <span className="material-symbols-outlined" id="account-page-user-icon">account_circle</span>
                            ) : null}
                            {!isProfilePicturePending && !imageError && <img src={imageSourceUrl} id="account-page-user-image" alt="user"/>}
                        </div>
                        <div id="account-page-info-inner-div">
                            <div id="account-page-info-keys-div">
                                <p>username:</p>
                                <p>name:</p>
                                <p>e-mail:</p>
                                <p>phone number:</p>
                            </div>
                            <div id="account-page-info-values-div">
                                <div>{accountInfo._username}</div>
                                <div>{accountInfo.firstName + " " + accountInfo.lastName}</div>
                                <div>{accountInfo.email}</div>
                                <div>{accountInfo.phoneNumber ? formatPhoneNumberIntl(accountInfo.phoneNumber) : "No phone number added"}</div>
                                <button id="account-page-email-button" onClick={() => setIsPhoneNumberPopupVisible(true)}>{accountInfo.phoneNumber ? "Modify phone number" : "Add phone number"}</button>
                            </div>
                        </div>
                        <br/>
                        <hr style={{backgroundColor:"black", height:2, border:"none"}}/>
                            <button
                                className={navigationOptions[0] ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                                onClick={handleOrders}
                            >Orders</button>
                            <button
                                className={navigationOptions[1] ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                                onClick={handleFavorites}
                            >Favorites</button>
                            <button
                                className={navigationOptions[2] ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                                onClick={handleMyReviews}
                            >My reviews</button>
                            <button
                                className={navigationOptions[3] ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                                onClick={handleMyCreditCards}
                            >My credits cards</button>
                            <button
                                className={navigationOptions[4] ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                                onClick={handleMyAddresses}
                            >My addresses</button>
                            {accountInfo.role === "ADMIN" && <button
                                className={navigationOptions[5] ? "account-page-navigation-button-clicked":"account-page-navigation-button"}
                                onClick={handleManageProducts}
                            >Manage Products</button>}
                        </div>
                    <button id="account-page-log-out-button" onClick={handleLogOut}><span className="material-symbols-outlined">power_settings_new</span>Log out</button>
                </div>
                <div id="account-page-side-content-div">
                    {navigationOptions[5] && <ManageProductsPage></ManageProductsPage>}
                    {navigationOptions[2] && <MyReviewsPage></MyReviewsPage>}
                    {navigationOptions[1] && <MyFavoritesPage shoppingCartEntries={props.shoppingCartEntries} setShoppingCartEntries = {props.setShoppingCartEntries}></MyFavoritesPage >}
                </div>
            </div>
            <CustomPopup show={isPhoneNumberPopupVisible} onClose={() => setIsPhoneNumberPopupVisible(false)}>
                <div id="account-page-phone-number-popup-div"
                     className={isLoadingModifyPhoneNumber ? "phone-number-div-expanded-loading" : (modifyPhoneNumberError ? "phone-number-div-expanded-error" : "phone-number-div-not-expanded")}>
                    <form onSubmit={(e) => handleChangePhoneNumber(e)}>
                        <p>Phone Number</p>
                        <PhoneInput id="account-page-phone-number-element" placeholder="Enter phone number" value={phoneValue} onChange={setPhoneValue}></PhoneInput>
                        <button id = "account-page-phone-number-popup-button">Submit</button>
                    </form>
                    {isLoadingModifyPhoneNumber && <div className="lds-roller" id="account-page-email-loading-animation">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>}
                    {modifyPhoneNumberError && <p style={{color:"darkred", marginTop:5}}>{modifyPhoneNumberError}</p>}
                </div>
            </CustomPopup>
            <CustomPopup show={isChangeProfilePicturePopupVisible} onClose={() => setIsChangeProfilePicturePopupVisible(false)}>
                <div id="account-page-profile-image-popup-div">
                    <div id="account-page-profile-image-label">Select profile image:</div>
                    <label htmlFor="account-page-profile-image-input" id="account-page-profile-image-input-label">
                        <span className="material-symbols-outlined" style={{fontSize:35}}>upload</span>
                    </label>
                    <input type="file"
                           name = "userImage"
                           id="account-page-profile-image-input"
                           onChange={(event) => {
                               const files = event.target.files;
                               if(files && files.length === 1)
                               { // @ts-ignore
                                   setSelectedProfileImage(files[0])
                                   console.log(files);
                               }
                           }}/>
                    {selectedProfileImage && (
                        <div id="account-page-profile-image-div">
                                <img alt="not found"
                                     id="account-page-new-user-image"
                                     src={URL.createObjectURL(selectedProfileImage)}
                                />
                        </div>
                    )}
                    {selectedProfileImage && <button id="account-page-submit-profile-picture-button" onClick={handleChangeProfileImage}>Change</button>}
                    {isSetProfileImagePending && <div className="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>}
                    {selectedProfileImageError && <p style={{marginTop:5, color: "darkred"}}>{selectedProfileImageError}</p>}
                </div>
            </CustomPopup>
        </div>
    )

}

export default AccountPage