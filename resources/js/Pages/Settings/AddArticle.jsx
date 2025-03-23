import { Head, router } from "@inertiajs/react";
import Dashboard from "../Dashboard";
import { useState, useRef } from "react";
import VirtualKeyboard from "../../Components/VirtualKeyboard";

export default function AddArticle() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null); // Use null for file input
    const [gender, setGender] = useState('');
    const [keyboardInput, setKeyboardInput] = useState('name'); // Track which input is active
    const [showKeyboard, setShowKeyboard] = useState(false); // Control keyboard visibility
    const keyboardRefName = useRef(null);
    const keyboardRefDescription = useRef(null);

    // Handle keyboard input changes
    const onKeyboardChange = (input) => {
        if (keyboardInput === 'name') {
            setName(input);
        } else if (keyboardInput === 'description') {
            setDescription(input);
        }
    };

    // Handle key press (e.g., Enter to submit)
    const onKeyPress = (button) => {
        if (button === '{enter}') {
            handleSubmit();
        }
    };

    // Handle input focus to show the keyboard and set the active input
    const handleNameFocus = () => {
        setKeyboardInput('name');
        setShowKeyboard(true);
        if (keyboardRefName.current) {
            keyboardRefName.current.setInput(name || '');
        }
    };

    const handleDescriptionFocus = () => {
        setKeyboardInput('description');
        setShowKeyboard(true);
        if (keyboardRefDescription.current) {
            keyboardRefDescription.current.setInput(description || '');
        }
    };

    // Handle file input change
    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Store the selected file
    };

    // Handle form submission using Inertia
    const handleSubmit = (e) => {
        if (e) e.preventDefault(); // Prevent default form submission if called via form

        // Validate required fields
        if (!name || !description || !gender) {
            alert('Please fill in all required fields (name, description, gender).');
            return;
        }

        // Create a FormData object to handle file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('gender', gender);
        if (image) {
            formData.append('image', image); // Add the image file if selected
        }

        // Submit the form using Inertia's router.post
        router.post(route('settings.storeArticle'), formData, {
            onSuccess: () => {
                // Reset the form on success
                setName('');
                setDescription('');
                setImage(null);
                setGender('');
                setShowKeyboard(false);
                alert('Article added successfully!');
            },
            onError: (errors) => {
                console.error(errors);
                alert('Error adding article: ' + (Object.values(errors).join(', ') || 'Unknown error'));
            },
        });
    };

    return (
        <Dashboard>
            <Head title="Add Article" />
            <div className="container">
                <h1 className="title">Add Article</h1>
                <form onSubmit={handleSubmit} className="form-section">
                    <div className="form-group">
                        <label htmlFor="name" className="label">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            readOnly
                            onFocus={handleNameFocus}
                            className="quantity-input"
                            placeholder="Enter article name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description" className="label">Description</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            readOnly
                            onFocus={handleDescriptionFocus}
                            className="quantity-input"
                            placeholder="Enter description"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender" className="label">Gender</label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="quantity-input"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="home">Home</option>
                        </select>
                    </div>
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
                            {keyboardInput === 'name' && (
                                <VirtualKeyboard
                                    keyboardRef={keyboardRefName}
                                    onChange={onKeyboardChange}
                                    onKeyPress={onKeyPress}
                                    inputName="name"
                                    initialLayout="alphanumeric"
                                    initialValue={name}
                                />
                            )}
                            {keyboardInput === 'description' && (
                                <VirtualKeyboard
                                    keyboardRef={keyboardRefDescription}
                                    onChange={onKeyboardChange}
                                    onKeyPress={onKeyPress}
                                    inputName="description"
                                    initialLayout="alphanumeric"
                                    initialValue={description}
                                />
                            )}
                        </div>
                    )}

                    <button type="submit" className="add-button mt-4">
                        Submit
                    </button>
                </form>
            </div>
        </Dashboard>
    );
}