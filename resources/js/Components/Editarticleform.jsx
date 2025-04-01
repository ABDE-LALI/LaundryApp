import { Head, router } from "@inertiajs/react";
import { useState, useRef, useEffect, useCallback } from "react";
import VirtualKeyboard from "./VirtualKeyboard";
import Dashboard from "@/Pages/Dashboard";

export default function EditArticleForm(props) {
    const [formData, setFormData] = useState({
        name: props.article.name || '',
        description: props.article.description || '',
        gender: props.article.gender || '',
        washPrice: props.article.washPrice || '',
        dryPrice: props.article.dryPrice || '',
        ironPrice: props.article.ironPrice || '',
        paintPrice: props.article.paintPrice || ''
    });

    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(props.article.image || '');
    const [keyboardInput, setKeyboardInput] = useState(null);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [keyboardLayout, setKeyboardLayout] = useState('alphanumeric');
    const [showConfirm, setShowConfirm] = useState(false); // New state for confirmation dialog
    const keyboardRef = useRef(null);

    useEffect(() => {
        return () => {
            if (currentImage && currentImage.startsWith('blob:')) {
                URL.revokeObjectURL(currentImage);
            }
        };
    }, [currentImage]);

    const onKeyboardChangeAll = useCallback((inputs) => {
        if (keyboardInput) {
            setFormData((prevData) => ({
                ...prevData,
                [keyboardInput]: inputs[keyboardInput] || ''
            }));
        }
    }, [keyboardInput]);

    const onKeyPress = (button) => {
        if (button === '{enter}') {
            setShowConfirm(true); // Show confirmation instead of submitting directly
        }
    };

    const handleInputClick = (field) => {
        setKeyboardInput(field);
        setShowKeyboard(true);
        const isPriceField = ["washPrice", "dryPrice", "ironPrice", "paintPrice"].includes(field);
        setKeyboardLayout(isPriceField ? "numeric" : "alphanumeric");
        if (keyboardRef.current) {
            keyboardRef.current.setInput(formData[field] || '', field);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setCurrentImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.gender) {
            alert('Please fill in all required fields (name and gender).');
            return;
        }

        const formPayload = new FormData();
        formPayload.append('id', props.article.id);
        Object.keys(formData).forEach((key) => formPayload.append(key, formData[key]));
        if (image) {
            formPayload.append('image', image);
        }
        formPayload.append('_method', 'PUT');

        router.post(route('settings.updateArticle'), formPayload, {
            onSuccess: () => {
                props.setshowmodifyForm(false);
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
                setCurrentImage('');
                setShowKeyboard(false);
                setKeyboardInput(null);
                alert('Article updated successfully!');
            },
            onError: (errors) => {
                console.error(errors);
                alert('Error updating article: ' + (Object.values(errors).join(', ') || 'Unknown error'));
            },
        });
    };

    // Confirmation Dialog Component
    const ConfirmationDialog = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <p className="text-gray-700 mb-4">Are you sure you want to update this article?</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => {
                            handleSubmit();
                            setShowConfirm(false);
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => setShowConfirm(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
            <div className="bg-white p-8 rounded-xl shadow-2xl h-[80vh] max-h-[90vh] max-w-[90vw] w-full overflow-auto transform transition-all duration-300 scale-100 hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Section */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900">Edit Article</h3>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onFocus={() => handleInputClick('name')}
                                placeholder="Click to edit name"
                                readOnly
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onFocus={() => handleInputClick('description')}
                                placeholder="Click to edit description"
                                readOnly
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="home">Home</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {["washPrice", "dryPrice", "ironPrice", "paintPrice"].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {field.replace("Price", " Price")}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData[field]}
                                        onFocus={() => handleInputClick(field)}
                                        placeholder={`Click to edit ${field.replace("Price", " price")}`}
                                        readOnly
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Article Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {currentImage ? (
                                    <img
                                        src={currentImage.startsWith('blob:') ? currentImage : `/storage/${currentImage}`}
                                        alt="Current article"
                                        className="max-w-full h-48 object-contain mx-auto mb-4 rounded-lg"
                                    />
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

                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                type="submit"
                                onClick={() => setShowConfirm(true)} // Show confirmation dialog
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
                            >
                                Update Article
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    props.setshowmodifyForm(false);
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
            {showConfirm && <ConfirmationDialog />}
        </div>
    );
}