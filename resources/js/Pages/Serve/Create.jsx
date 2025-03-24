import { RightSideBar } from "@/src/Fragments/RightSideBar";
import Dashboard from "../Dashboard";
import React, { useState, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import VirtualKeyboard from '../../Components/VirtualKeyboard';
// const Create = () => {
//     const [quantity, setQuantity] = useState('');
//     const [brand, setBrand] = useState('');
//     const [activeInput, setActiveInput] = useState(null);
//     const [keyboardLayout, setKeyboardLayout] = useState('numeric');
//     const keyboardRef = useRef(null);

//     const onKeyboardChangeAll = (inputs) => {
//         if (activeInput === 'quantity') {
//             setQuantity(inputs['quantity'] || '');
//         } else if (activeInput === 'brand') {
//             setBrand(inputs['brand'] || '');
//         }
//     };

//     const handleQuantityFocus = () => {
//         setActiveInput('quantity');
//         setKeyboardLayout('numeric');
//         if (keyboardRef.current) {
//             keyboardRef.current.setInput(quantity, 'quantity'); // Set initial value
//         }
//     };

//     const handleBrandFocus = () => {
//         setActiveInput('brand');
//         setKeyboardLayout('alphanumeric');
//         if (keyboardRef.current) {
//             keyboardRef.current.setInput(brand, 'brand'); // Set initial value
//         }
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 value={quantity}
//                 onFocus={handleQuantityFocus}
//                 placeholder="Quantity"
//             />
//             <input
//                 type="text"
//                 value={brand}
//                 onFocus={handleBrandFocus}
//                 placeholder="Brand"
//             />
//             <VirtualKeyboard
//                 keyboardRef={keyboardRef}
//                 onChangeAll={onKeyboardChangeAll}
//                 initialLayout={keyboardLayout}
//                 inputName={activeInput} // Pass the active input name
//             />
//         </div>
//     );
// };
export default function Create() {
    const { articles, services, ticket_id } = usePage().props;
    const [selectedArticle, setSelectedArticle] = useState('');
    const [selectedService, setSelectedService] = useState('');
    // const [quantity, setQuantity] = useState('');
    // const [brand, setBrand] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [showkeyorder, setShowKeyOrder] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    // const [keyboardLayout, setKeyboardLayout] = useState('numeric');
    // const [activeInput, setActiveInput] = useState(null); // Track the active input
    // const keyboardRef = useRef(null);
    const [quantity, setQuantity] = useState('');
    const [brand, setBrand] = useState('');
    const [activeInput, setActiveInput] = useState(null);
    const [keyboardLayout, setKeyboardLayout] = useState('numeric');
    const keyboardRef = useRef(null);

    // const onKeyboardChangeAll = (inputs) => {
    //     if (activeInput === 'quantity') {
    //         setQuantity(inputs['quantity'] || '');
    //     } else if (activeInput === 'brand') {
    //         setBrand(inputs['brand'] || '');
    //     }
    // };

    const onKeyboardChangeAll = (inputs) => {
        if (activeInput === 'quantity') {
            setQuantity(inputs['quantity'] || '');
        } else if (activeInput === 'brand') {
            setBrand(inputs['brand'] || '');
        }
    };

    const handleAddOrUpdateOrder = () => {
        if (selectedArticle && selectedService && quantity) {
            const selectedArticleObj = articles.find((a) => a.id === parseInt(selectedArticle));
            const selectedServiceObj = services.find((s) => s.id === parseInt(selectedService));
            if (!selectedArticleObj) return;

            const item = {
                article: selectedArticleObj,
                service: selectedServiceObj,
                totalPrice: selectedArticleObj.price * parseFloat(quantity),
                quantity: parseFloat(quantity),
                brand: brand || 'No Brand entered',
                color: selectedColor || 'No Color Selected',
            };

            if (editingIndex !== null) {
                setOrderItems((prevItems) => {
                    const updatedItems = [...prevItems];
                    updatedItems[editingIndex] = item;
                    return updatedItems;
                });
                setEditingIndex(null);
            } else {
                setOrderItems((prevItems) => [...prevItems, item]);
            }

            setSelectedArticle('');
            setSelectedService('');
            setQuantity('');
            setBrand('');
            setSelectedColor('');
            setShowKeyOrder(false);
            setActiveInput(null);
            if (keyboardRef.current) {
                keyboardRef.current.setInput('', 'quantity');
                keyboardRef.current.setInput('', 'brand');
            }
        }
    };

    const handleEdit = (index) => {
        const item = orderItems[index];
        setSelectedArticle(item.article.id);
        setSelectedService(item.service.id);
        setQuantity(item.quantity.toString());
        setBrand(item.brand);
        setSelectedColor(item.color);
        setEditingIndex(index);
        setShowKeyOrder(true);
        setKeyboardLayout('numeric');
        if (keyboardRef.current) {
            keyboardRef.current.setInput(item.quantity.toString(), 'quantity');
            keyboardRef.current.setInput(item.brand, 'brand');
        }
    };

    const handleDelete = (index) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            setOrderItems((prevItems) => prevItems.filter((_, i) => i !== index));
        }
    };

    // const handleQuantityFocus = () => {
    //     setActiveInput('quantity');
    //     setKeyboardLayout('numeric');
    //     if (keyboardRef.current) {
    //         keyboardRef.current.setInput(quantity, 'quantity');
    //     }
    // };
    const handleQuantityFocus = () => {
        setActiveInput('quantity');
        setKeyboardLayout('numeric');
        if (keyboardRef.current) {
            keyboardRef.current.setInput(quantity, 'quantity'); // Set initial value
        }
    };

    // const handleBrandFocus = () => {
    //     setActiveInput('brand');
    //     setKeyboardLayout('alphanumeric');
    //     if (keyboardRef.current) {
    //         keyboardRef.current.setInput(brand, 'brand');
    //     }
    // };
    const handleBrandFocus = () => {
        setActiveInput('brand');
        setKeyboardLayout('alphanumeric');
        if (keyboardRef.current) {
            keyboardRef.current.setInput(brand, 'brand'); // Set initial value
        }
    };

    const valider = () => {
        if (orderItems.length > 0) {
            if (window.confirm('Êtes-vous sûr de vouloir valider ces commandes ?')) {
                const data = orderItems.map((item) => ({
                    ticket_id: ticket_id,
                    article_id: item.article.id,
                    service_id: item.service.id,
                    price: 33,
                    quantity: item.quantity,
                    brand: item.brand,
                    color: item.color,
                }));
                let total_price = data.reduce((acc, item) => acc + item.price * item.quantity, 0);

                router.post(
                    route('serve.ticket.store'),
                    {
                        quantity: data.reduce((acc, item) => acc + item.quantity, 0),
                        total_price: total_price,
                    },
                    {
                        onSuccess: () => {
                            router.post(
                                route('serve.store'),
                                { items: data },
                                {
                                    onSuccess: () => {
                                        setOrderItems([]);
                                        alert('Commandes soumises avec succès !');
                                    },
                                    onError: (errors) => {
                                        console.error(errors);
                                        alert('Erreur lors de la soumission des commandes.');
                                    },
                                }
                            );
                        },
                        onError: (errors) => {
                            console.error(errors);
                            alert('Erreur lors de la création du ticket.');
                        },
                    }
                );
            }
        }
    };

    const colorOptions = [
        // Your color options here
    ];

    return (
        <Dashboard>
            <div className="container">
                <h2 className="title">Prendre Commandes</h2>
                <div className="form-section">
                    {/* Article Selection */}
                    <div>
                        <label className="label">Article</label>
                        <div className="article-grid">
                            {articles?.map((article) => (
                                <button
                                    key={article.id}
                                    onClick={() => {
                                        setSelectedArticle(article.id);
                                        setQuantity('');
                                        setBrand('');
                                        setSelectedColor('');
                                        setShowKeyOrder(true);
                                        setKeyboardLayout('numeric');
                                        setActiveInput('quantity');
                                        if (keyboardRef.current) {
                                            keyboardRef.current.setInput('', 'quantity');
                                            keyboardRef.current.setInput('', 'brand');
                                        }
                                    }}
                                    className={`article-card ${selectedArticle === article.id ? 'article-card-selected' : ''}`}
                                >
                                    <span className="article-name">{article.name}</span>
                                    <img src={`/storage/${article.image}`} alt={article.name} className="article-image" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Virtual Keyboard */}
                    {showkeyorder && (
                        <div className="keyboard-order">
                            {/* <div className="keyboard-container">
                                <div className="brand-quantity">
                                    <label className="label">Marque</label>
                                    <input
                                        className="quantity-input"
                                        value={brand}
                                        readOnly
                                        onFocus={handleBrandFocus}
                                        placeholder="Enter brand"
                                    />
                                    <label className="label">Quantité</label>
                                    <input
                                        value={quantity}
                                        readOnly
                                        onFocus={handleQuantityFocus}
                                        className="quantity-input"
                                        placeholder="Enter quantity"
                                    />
                                </div>
                                <VirtualKeyboard
                                    keyboardRef={keyboardRef}
                                    onChangeAll={onKeyboardChangeAll}
                                    initialLayout={keyboardLayout}
                                />
                            </div> */}
                            <div>
                                <input
                                    type="text"
                                    value={quantity}
                                    onFocus={handleQuantityFocus}
                                    placeholder="Quantity"
                                />
                                <input
                                    type="text"
                                    value={brand}
                                    onFocus={handleBrandFocus}
                                    placeholder="Brand"
                                />
                                <VirtualKeyboard
                                    keyboardRef={keyboardRef}
                                    onChangeAll={onKeyboardChangeAll}
                                    initialLayout={keyboardLayout}
                                    inputName={activeInput} // Pass the active input name
                                />
                            </div>
                            <div className="order-detail">
                                <label className="label">Services</label>
                                <div className="service-grid">
                                    {services?.map((service) => (
                                        <button
                                            key={service.id}
                                            onClick={() => setSelectedService(service.id)}
                                            className={`service-card ${selectedService === service.id ? 'service-card-selected' : ''}`}
                                        >
                                            <img src={`/storage/${service.image}`} alt={service.name} className="service-image" />
                                            <span className="service-name">{service.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    <label className="label">Couleur</label>
                                    <div className="color-grid">
                                        {colorOptions.map((colorGroup, index) => (
                                            <div key={index} className="color">
                                                {colorGroup.map((color) => (
                                                    <button
                                                        key={color.name}
                                                        onClick={() => setSelectedColor(color.name)}
                                                        className={`color-swatch ${selectedColor === color.name ? 'color-swatch-selected' : ''}`}
                                                        style={{ backgroundColor: color.value }}
                                                    ></button>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="color-info">Selected Color: {selectedColor || 'None'}</p>
                                </div>
                                <button
                                    onClick={handleAddOrUpdateOrder}
                                    disabled={!selectedArticle || !selectedService || !quantity}
                                    className="add-button"
                                >
                                    {editingIndex !== null ? 'Modifier la commande' : 'Ajouter à la commande'}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingIndex(null);
                                        setSelectedArticle('');
                                        setSelectedService('');
                                        setQuantity('');
                                        setBrand('');
                                        setSelectedColor('');
                                        setShowKeyOrder(false);
                                        setActiveInput(null);
                                    }}
                                    className="cancel-button"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3 className="order-title text-lg font-semibold mb-2">Commandes en cours</h3>
                        <div className="order-table">
                            <table className="min-w-full border-collapse border border-gray-300">
                                <caption>Ticket Id: {ticket_id + 1}</caption>
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Article</th>
                                        <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Service</th>
                                        <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Prix</th>
                                        <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Quantité</th>
                                        <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Prix Total (DH)</th>
                                        <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Couleur</th>
                                        <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Marque</th>
                                        <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">{item.article.name}</td>
                                            <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">{item.service.name}</td>
                                            <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">
                                                {item.article.price ? `${item.article.price} DH` : 'N/A'}
                                            </td>
                                            <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">x{item.quantity}</td>
                                            <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">
                                                {item.article.price ? `${item.quantity * item.article.price} DH` : 'N/A'}
                                            </td>
                                            <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">{item.color}</td>
                                            <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">{item.brand}</td>
                                            <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">
                                                <button onClick={() => handleEdit(index)} className="edit-button mr-2">
                                                    Modifier
                                                </button>
                                                <button onClick={() => handleDelete(index)} className="delete-button">
                                                    Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="bg-green-400 p-1" onClick={valider}>Valider</button>
                        </div>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}