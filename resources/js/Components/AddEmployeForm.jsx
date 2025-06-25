import { Head, router } from "@inertiajs/react";
import { useState, useRef, useCallback, useEffect } from "react";
import VirtualKeyboard from "./VirtualKeyboard";
import Dashboard from "@/Pages/Dashboard";

export default function AddEmployeForm(props) {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        phone1:'',
        phone2:'',
        password: '',
        passwordconf: '',
    });

    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [keyboardInput, setKeyboardInput] = useState(null);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [keyboardLayout, setKeyboardLayout] = useState('alphanumeric');
    const [showConfirm, setShowConfirm] = useState(false);
    const [notification, setNotification] = useState(null);
    const keyboardRef = useRef(null);

    // Cleanup preview URL when component unmounts or image changes
    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

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
            setShowConfirm(true);
        }
    };

    const handleFocus = (field) => {
        setKeyboardInput(field);
        setShowKeyboard(true);
        const isphone = ["phone1", "phone2"].includes(field);
        setKeyboardLayout(isphone ? "numeric" : "alphanumeric");
        if (keyboardRef.current) {
            keyboardRef.current.setInput(formData[field] || '', field);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        if (!formData.firstname || !formData.lastname || !formData.phone1 || !formData.phone2 || !formData.password || !formData.passwordconf) {
            setNotification({ type: "error", message: "Please fill in all required fields (name, description, and gender)." });
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        const formPayload = new FormData();
        Object.keys(formData).forEach((key) => formPayload.append(key, formData[key]));
        if (image) formPayload.append('image', image);

        router.post(route('settings.storeEmploye'), formPayload, {
            onSuccess: () => {
                setFormData({ firstname: '', lastname: '', phone1: '', phone2: '', password: '', passwordconf: ''});
                setImage(null);
                setPreviewImage(null);
                setShowKeyboard(false);
                setKeyboardInput(null);
                props.setshowaddForm(false);
                setNotification({ type: "success", message: "Employe added successfully!" });
                setTimeout(() => setNotification(null), 3000);
            },
            onError: (errors) => {
                console.error(errors);
                setNotification({
                    type: "error",
                    message: 'Error adding employe: ' + (Object.values(errors).join(', ') || 'Unknown error')
                });
                setTimeout(() => setNotification(null), 3000);
            },
        });
    };

    const ConfirmationDialog = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-60">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <p className="text-gray-700 mb-4">Are you sure you want to add this employe?</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => {
                            handleSubmit();
                            setShowConfirm(false);
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => setShowConfirm(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );

    const Notification = ({ type, message }) => (
        <div className="fixed top-4 right-4 z-70">
            <div
                className={`p-4 rounded-lg shadow-lg text-white flex items-center gap-2 animate-fade-in ${
                    type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
            >
                <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
                <p className="font-medium">{message}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
            <div className="bg-white p-8 rounded-xl shadow-2xl h-[80vh] max-h-[90vh] max-w-[90vw] w-full overflow-auto transform transition-all duration-300 scale-100 hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Section */}
                    <div className="w-full md:w-2/3 space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900">Add New Employe</h3>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">FirstName</label>
                            <input
                                type="text"
                                value={formData.firstname}
                                onFocus={() => handleFocus('firstname')}
                                placeholder="Click to enter firstname"
                                readOnly
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">LastName</label>
                            <input
                                type="text"
                                value={formData.lastname}
                                onFocus={() => handleFocus('lastname')}
                                placeholder="Click to enter lastname"
                                readOnly
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone1</label>
                            <input
                                type="text"
                                value={formData.phone1}
                                onFocus={() => handleFocus('phone1')}
                                placeholder="Click to enter phone1"
                                readOnly
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone2</label>
                            <input
                                type="text"
                                value={formData.phone2}
                                onFocus={() => handleFocus('phone2')}
                                placeholder="Click to enter phone2"
                                readOnly
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                type="text"
                                value={formData.password}
                                onFocus={() => handleFocus('password')}
                                placeholder="Click to enter password"
                                readOnly
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirme The Password</label>
                            <input
                                type="text"
                                value={formData.passwordconf}
                                onFocus={() => handleFocus('passwordconf')}
                                placeholder="Click to confirme the password"
                                readOnly
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        
                    </div>

                    {/* Right Section */}
                    <div className="w-full md:w-1/3 space-y-2">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Employe Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {!showKeyboard && (
                                    previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Selected article"
                                            className="max-w-full h-48 object-contain mx-auto mb-4 rounded-lg"
                                        />
                                    ) : (
                                        <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                                            <span className="text-gray-400">No image selected</span>
                                        </div>
                                    )
                                )}
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    onClick={()=> setShowKeyboard(false)}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        {showKeyboard && (
                            <div className="bg-gray-100 p-4 rounded-lg shadow-inner relative">
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
                                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <span className="text-lg font-bold">×</span>
                                </button>
                            </div>
                        )}

                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                type="submit"
                                onClick={() => setShowConfirm(true)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
                            >
                                Add Employe
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
            {showConfirm && <ConfirmationDialog />}
            {notification && <Notification type={notification.type} message={notification.message} />}
        </div>
    );
}