import './CustomPopup.css'
import React, {useState, useEffect, useRef} from "react";

// @ts-ignore
const CustomPopup = ({ show, onClose, children }) => {

    const popupRef = useRef<any>(null);
    const [mounted, setMounted] = useState(false);

    // Close the popup when a click occurs outside of it
    const handleClickOutside = (event:any) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        // Attach the event listener when the popup is shown
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
            setMounted(true);
        } else {
            // Remove the event listener when the popup is hidden
            document.removeEventListener('mousedown', handleClickOutside);
        }
        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, handleClickOutside]);

    if (!show) return null;

    return (
        <div id="popup-outer-div" ref={popupRef} className={mounted ? 'scale-in' : ''}>
            <button id="popup-close-button" onClick={onClose}>
                X
            </button>
            <div id="popup-content">
                {children}
            </div>
        </div>
    );
};

export default CustomPopup;