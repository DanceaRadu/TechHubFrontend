import './IntervalSelector.css'
import {useEffect, useRef, useState} from "react";

function IntervalSelector(props:any) {

    const [leftPosition, setLeftPosition] = useState<number>(0);
    const [rightPosition, setRightPosition] = useState<number>(0);

    const lineRef = useRef<any>(null);
    let maxValue = props.maxValue;
    let minValue = props.minValue;
    let setSelectedOption = props.setSelectedOption

    let currentMinValue = props.currentMinValue;
    let setCurrentMinValue = props.setCurrentMinValue;
    let currentMaxValue = props.currentMaxValue;
    let setCurrentMaxValue = props.setCurrentMaxValue;

    function convertOffsetToValue(offset:number):number {
        return Math.ceil((offset+12)*(maxValue-minValue)/262);
    }
    function convertValueToOffset(value:number) {
        return Math.floor((value * 262) / (maxValue - minValue) - 12);
    }
    useEffect(() => {
        if(lineRef.current !== null) {
            setLeftPosition(convertValueToOffset(currentMinValue));
            setRightPosition(convertValueToOffset(currentMaxValue));
        }
    }, [lineRef.current, currentMinValue, currentMaxValue]);

    const handleRightDragStart = (e:any) => {
        setSelectedOption(null);
        // Get the initial position when dragging starts
        const initialX = Math.ceil(e.clientX - rightPosition);
        const handleMouseMove = (e:any) => {
            // Calculate the new position of the div as the mouse is moved
            const newX = Math.ceil(e.clientX) - initialX;
            if(newX <= (lineRef.current.offsetWidth-10) && newX >= 10) {
                if(leftPosition > newX-22) {
                    setLeftPosition(newX-22);
                    setCurrentMinValue(convertOffsetToValue(newX-22));
                }
                setRightPosition(newX);
                setCurrentMaxValue(convertOffsetToValue(newX));
            }
        };

        const handleDragEnd = () => {
            // Remove event listeners when dragging ends
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleDragEnd);
        };

        // Add event listeners to track mouse movements and release
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleDragEnd);
    };

    const handleLeftDragStart = (e:any) => {
        setSelectedOption(null);
        const initialX = e.clientX - leftPosition;
        const handleMouseMove = (e:any) => {
            // Calculate the new position of the div as the mouse is moved
            const newX = e.clientX - initialX;
            // @ts-ignore
            if(newX <= (lineRef.current.offsetWidth-32) && newX >= -12) {
                if(rightPosition < newX+22) {
                    setRightPosition(newX+22);
                    setCurrentMaxValue(convertOffsetToValue(newX+22));
                }
                setLeftPosition(newX);
                setCurrentMinValue(convertOffsetToValue(newX));
            }
        };

        const handleDragEnd = () => {
            // Remove event listeners when dragging ends
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleDragEnd);
        };

        // Add event listeners to track mouse movements and release
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleDragEnd);
    }

    return (
        <div id="interval-selector-outer-div">
            <div id="interval-selector-line" ref={lineRef}>
                <div id="interval-selector-left-div"
                     onMouseDown={handleLeftDragStart}
                     style={{
                         left: leftPosition + 'px'
                     }}
                >
                </div>
                <div id="interval-selector-right-div"
                     onMouseDown={handleRightDragStart}
                     style={{
                         left: rightPosition + 'px'
                     }}
                ></div>
            </div>
        </div>
    )

}

export default IntervalSelector