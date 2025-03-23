import { Head, router } from "@inertiajs/react";
import { useState, useRef } from "react";
import { usePage } from "@inertiajs/react";
import Dashboard from "@/Pages/Dashboard";
import VirtualKeyboard from "./VirtualKeyboard";

export default function EditArticleForm(props) {

    // Initialize state with the article's existing data
    const [name, setName] = useState(props.article.name || '');
    const [description, setDescription] = useState(props.article.description || '');
    const [image, setImage] = useState(null); // For new image uploads
    const [currentImage, setCurrentImage] = useState(props.article.image || ''); // Store the existing image path
    const [gender, setGender] = useState(props.article.gender || '');
    const [keyboardInput, setKeyboardInput] = useState('name');
    const [showKeyboard, setShowKeyboard] = useState(false);
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
        setImage(e.target.files[0]); // Store the new image file
        setCurrentImage(URL.createObjectURL(e.target.files[0])); // Preview the new image
    };

    // Handle form submission using Inertia
    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        // Validate required fields
        if (!name || !gender) {
            alert('Please fill in all required fields (name, description, gender).');
            return;
        }

        // Create a FormData object to handle file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('gender', gender);
        if (image) {
            formData.append('image', image); // Add the new image file if selected
        }
        formData.append('_method', 'PATCH'); // Spoof the PUT request for Laravel

        // Submit the form using Inertia's router.put
        router.post(route('settings.updateArticle', props.article.id), formData, {
            onSuccess: () => {
                // Reset the form on success
                props.setshowmodifyForm(false)
                setName('');
                setDescription('');
                setImage(null);
                setCurrentImage('');
                setGender('');
                setShowKeyboard(false);
                alert('Article updated successfully!');
            },
            onError: (errors) => {
                console.error(errors);
                alert('Error updating article: ' + (Object.values(errors).join(', ') || 'Unknown error'));
            },
        });
    };

    return (
            <div className="edit-form">
            <Head title="Edit Article" />
            <div className="container">
                <h1 className="title">Edit Article</h1>
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
                        {currentImage && (
                            <div className="image-preview">
                                <img
                                    src={currentImage.startsWith('blob:') ? currentImage : `/storage/${currentImage}`}
                                    alt="Current article"
                                    className="article-image"
                                    style={{ maxWidth: '100px', marginBottom: '10px' }}
                                />
                            </div>
                        )}
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
                        Update Article
                    </button>
                    <button onClick={()=>props.setshowmodifyForm(false)}>Annuler</button>
                </form>
            </div>
        </div>
    );
}