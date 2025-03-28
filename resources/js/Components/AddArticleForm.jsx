import { Head, router } from "@inertiajs/react";
import { useState, useRef, useCallback } from "react";
import VirtualKeyboard from "./VirtualKeyboard";
import Dashboard from "@/Pages/Dashboard"; // Import Dashboard for consistent layout

export default function AddArticleForm(props) {
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
    const [keyboardInput, setKeyboardInput] = useState(null);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [keyboardLayout, setKeyboardLayout] = useState('alphanumeric');
    const keyboardRef = useRef(null);

    const onKeyboardChangeAll = useCallback((inputs) => {
        if (keyboardInput) {
            setFormData((prevData) => ({
                ...prevData,
                [keyboardInput]: inputs[keyboardInput] || ''
            }));
        }
    }, [keyboardInput]);

    const onKeyPress = (button) => {
        if (button === '{enter}') handleSubmit();
    };

    const handleFocus = (field) => {
        setKeyboardInput(field);
        setShowKeyboard(true);
        const isPriceField = ["washPrice", "dryPrice", "ironPrice", "paintPrice"].includes(field);
        setKeyboardLayout(isPriceField ? "numeric" : "alphanumeric");
        if (keyboardRef.current) {
            keyboardRef.current.setInput(formData[field] || '', field);
        }
    };

    const preventDirectTyping = (e) => e.preventDefault();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.description || !formData.gender) {
            alert('Please fill in all required fields (name, description, and gender).');
            return;
        }

        const formPayload = new FormData();
        Object.keys(formData).forEach((key) => formPayload.append(key, formData[key]));
        if (image) formPayload.append('image', image);

        router.post(route('settings.storeArticle'), formPayload, {
            onSuccess: () => {
                setFormData({ name: '', description: '', gender: '', washPrice: '', dryPrice: '', ironPrice: '', paintPrice: '' });
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Head title="Add Article" />
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add Article</h1>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={preventDirectTyping}
                            onClick={() => handleFocus('name')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            placeholder="Click to enter article name"
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                            type="text"
                            id="description"
                            value={formData.description}
                            onChange={preventDirectTyping}
                            onClick={() => handleFocus('description')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            placeholder="Click to enter description"
                        />
                    </div>

                    {/* Gender Select */}
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            id="gender"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="home">Home</option>
                        </select>
                    </div>

                    {/* Price Fields */}
                    {["washPrice", "dryPrice", "ironPrice", "paintPrice"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700">{field.replace("Price", " Price")}</label>
                            <input
                                type="text"
                                value={formData[field]}
                                onChange={preventDirectTyping}
                                onClick={() => handleFocus(field)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                placeholder={`Click to enter ${field.replace("Price", " price")}`}
                            />
                        </div>
                    ))}

                    {/* Image Upload */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                        <input
                            type="file"
                            id="image"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            accept="image/*"
                        />
                    </div>

                    {/* Virtual Keyboard */}
                    {showKeyboard && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
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
                                className="mt-2 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
                            >
                                Hide Keyboard
                            </button>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex space-x-4 mt-6">
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                props.setshowaddForm(false);
                                setShowKeyboard(false);
                                setKeyboardInput(null);
                            }}
                            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}