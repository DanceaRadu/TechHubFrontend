import {UUID} from "crypto";
import {useEffect, useState} from "react";

function useCheckIsProductFavorite(productID:UUID, favoritesList:any) {

    const[isFavorite,setIsFavorite] = useState<boolean>(false);

    useEffect(() => {
        setIsFavorite(false);
        for(let i = 0; i < favoritesList.length; i++) {
            if(favoritesList[i].productID === productID) {
                setIsFavorite(true);
                break;
            }
        }

    }, [productID, favoritesList])

    return {isFavorite};
}

export default useCheckIsProductFavorite;