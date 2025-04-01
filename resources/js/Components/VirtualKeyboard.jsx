import React, { useState, useRef, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const VirtualKeyboard = ({ onChangeAll, onKeyPress, initialLayout = "numeric", keyboardRef, inputName }) => {
    const [layout, setLayout] = useState(initialLayout);
    const internalKeyboardRef = useRef(null);

    const keyboardLayout = {
        numeric: ["1 2 3", "4 5 6", "7 8 9", "0 . {bksp}"],
        alphanumeric: [
            "1 2 3 4 5 6 7 8 9 0",
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "{shift} z x c v b n m {bksp}",
            "{space}",
        ],
        alphanumericShift: [
            "! @ # $ % ^ & * ( )",
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "{shift} Z X C V B N M {bksp}",
            "{space}",
        ],
    };

    useEffect(() => {
        setLayout(initialLayout);
    }, [initialLayout]);

    const handleKeyPress = (button) => {
        if (button === "{shift}" || button === "{lock}") {
            setLayout(layout === "alphanumeric" ? "alphanumericShift" : "alphanumeric");
        }
        if (onKeyPress) onKeyPress(button);
    };

    const handleChangeAll = (inputs) => {
        if (onChangeAll) onChangeAll(inputs);
    };

    return (
        <Keyboard
            keyboardRef={(r) => {
                if (keyboardRef) keyboardRef.current = r;
                internalKeyboardRef.current = r;
            }}
            layoutName={layout}
            layout={keyboardLayout}
            onChangeAll={handleChangeAll} // Use onChangeAll for multi-input support
            onKeyPress={handleKeyPress}
            inputName={inputName} // Tie to the specific input
            display={{ "{bksp}": "⌫" }}
        />
    );
};

export default VirtualKeyboard;