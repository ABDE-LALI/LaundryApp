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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
            <div className="bg-white p-8 rounded-xl shadow-2xl h-[80vh] max-h-[90vh] max-w-[90vw] w-full overflow-auto transform transition-all duration-300 scale-100 hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Section */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900">Add New Article</h3>
                        
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onFocus={() => handleFocus('name')}
                                placeholder="Click to enter name"
                                readOnly
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onFocus={() => handleFocus('description')}
                                placeholder="Click to enter description"
                                readOnly
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {/* Gender Select */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="home">Home</option>
                            </select>
                        </div>

                        {/* Price Fields Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {["washPrice", "dryPrice", "ironPrice", "paintPrice"].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {field.replace("Price", " Price")}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData[field]}
                                        onFocus={() => handleFocus(field)}
                                        placeholder={`Click to enter ${field.replace("Price", " price")}`}
                                        readOnly
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="w-full md:w-1/2 space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Article Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {image ? (
                                    <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                                        <span className="text-gray-400">Image preview available after selection</span>
                                    </div>
                                ) : (
                                    <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                                        <span className="text-gray-400">No image selected</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        {/* Virtual Keyboard */}
                        {showKeyboard && (
                            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
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
                                    className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Hide Keyboard
                                </button>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
                            >
                                Add Article
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    props.setshowaddForm(false);
                                    setShowKeyboard(false);
                                    setKeyboardInput(null);
                                }}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}