import { Head, router } from "@inertiajs/react";
import { useState, useRef, useCallback } from "react";
import VirtualKeyboard from "./VirtualKeyboard";
import Dashboard from "@/Pages/Dashboard"; // Import Dashboard for consistent layout

export default function AddArticleForm(props) {
    // Single state object to manage all form fields
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        gender: '',
        washPrice: '',
        dryPrice: '',
        ironPrice: '',
        paintPrice: ''
    });

    const [image, setImage] = useState(null);
    const [keyboardInput, setKeyboardInput] = useState(null); // Tracks the active input field
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [keyboardLayout, setKeyboardLayout] = useState('alphanumeric'); // Default layout
    const keyboardRef = useRef(null); // Single ref for the keyboard

    // Handle keyboard input changes for all inputs
    const onKeyboardChangeAll = useCallback((inputs) => {
        if (keyboardInput) {
            setFormData((prevData) => ({
                ...prevData,
                [keyboardInput]: inputs[keyboardInput] || ''
            }));
        }
    }, [keyboardInput]);

    // Handle key press (e.g., Enter to submit)
    const onKeyPress = (button) => {
        if (button === '{enter}') {
            handleSubmit();
        }
    };

    // Handle input focus to show the keyboard and sync its state
    const handleFocus = (field) => {
        setKeyboardInput(field);
        setShowKeyboard(true);
        const isPriceField = ["washPrice", "dryPrice", "ironPrice", "paintPrice"].includes(field);
        setKeyboardLayout(isPriceField ? "numeric" : "alphanumeric");
        if (keyboardRef.current) {
            keyboardRef.current.setInput(formData[field] || '', field); // Sync keyboard with current value
        }
    };

    // Prevent direct typing in input fields
    const preventDirectTyping = (e) => e.preventDefault();

    // Handle file input change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    // Handle form submission using Inertia
    const handleSubmit = () => {
        if (!formData.name || !formData.description || !formData.gender) {
            alert('Please fill in all required fields (name, description, and gender).');
            return;
        }

        const formPayload = new FormData();
        Object.keys(formData).forEach((key) => formPayload.append(key, formData[key]));
        if (image) {
            formPayload.append('image', image);
        }

        router.post(route('settings.storeArticle'), formPayload, {
            onSuccess: () => {
                setFormData({
                    name: '',
                    description: '',
                    gender: '',
                    washPrice: '',
                    dryPrice: '',
                    ironPrice: '',
                    paintPrice: ''
                });
                setImage(null);
                setShowKeyboard(false);
                setKeyboardInput(null);
                props.setshowaddForm(false);
                alert('Article added successfully!');
            },
            onError: (errors) => {
                console.error(errors);
                alert('Error adding article: ' + (Object.values(errors).join(', ') || 'Unknown error'));
            },
        });
    };

    return (
            <div className="add-form" style={{ display: "flex", flexDirection: "column" }}>
                <Head title="Add Article" />
                <div className="container">
                    <h1 className="title">Add Article</h1>
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="form-section">
                        {/* Name Field */}
                        <div className="form-group">
                            <label htmlFor="name" className="label">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={preventDirectTyping}
                                onClick={() => handleFocus('name')}
                                className="quantity-input"
                                placeholder="Click to enter article name"
                            />
                        </div>

                        {/* Description Field */}
                        <div className="form-group">
                            <label htmlFor="description" className="label">Description</label>
                            <input
                                type="text"
                                id="description"
                                value={formData.description}
                                onChange={preventDirectTyping}
                                onClick={() => handleFocus('description')}
                                className="quantity-input"
                                placeholder="Click to enter description"
                            />
                        </div>

                        {/* Gender Select */}
                        <div className="form-group">
                            <label htmlFor="gender" className="label">Gender</label>
                            <select
                                id="gender"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="quantity-input"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="home">Home</option>
                            </select>
                        </div>

                        {/* Price Fields */}
                        {["washPrice", "dryPrice", "ironPrice", "paintPrice"].map((field) => (
                            <div className="form-group" key={field}>
                                <label className="label">{field.replace("Price", " Price")}</label>
                                <input
                                    type="text"
                                    value={formData[field]}
                                    onChange={preventDirectTyping}
                                    onClick={() => handleFocus(field)}
                                    className="quantity-input"
                                    placeholder={`Click to enter ${field.replace("Price", " price")}`}
                                />
                            </div>
                        ))}

                        {/* Image Upload */}
                        <div className="form-group">
                            <label htmlFor="image" className="label">Image</label>
                            <input
                                type="file"
                                id="image"
                                onChange={handleImageChange}
                                className="quantity-input"
                                accept="image/*"
                            />
                        </div>

                        {/* Virtual Keyboard */}
                        {showKeyboard && (
                            <div className="keyboard-container">
                                <VirtualKeyboard
                                    keyboardRef={keyboardRef}
                                    onChangeAll={onKeyboardChangeAll}
                                    onKeyPress={onKeyPress}
                                    initialLayout={keyboardLayout}
                                    inputName={keyboardInput}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowKeyboard(false);
                                        setKeyboardInput(null);
                                    }}
                                    className="hide-keyboard-button mt-2"
                                >
                                    Hide Keyboard
                                </button>
                            </div>
                        )}

                        <button type="submit" className="add-button mt-4">Submit</button>
                        <button
                            type="button"
                            onClick={() => {
                                props.setshowaddForm(false);
                                setShowKeyboard(false);
                                setKeyboardInput(null);
                            }}
                            className="cancel-button mt-4"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
    );
}