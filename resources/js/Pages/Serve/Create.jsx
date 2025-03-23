import { RightSideBar } from "@/src/Fragments/RightSideBar";
import Dashboard from "../Dashboard";
import React, { useState, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import VirtualKeyboard from '../../Components/VirtualKeyboard';

export default function Create() {
    const { articles, services, ticket_id } = usePage().props;
    const [selectedArticle, setSelectedArticle] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [quantity, setQuantity] = useState('');
    const [brand, setBrand] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [keyboardInput, setKeyboardInput] = useState('quantity');
    const [selectedColor, setSelectedColor] = useState('');
    const [showkeyorder, setShowKeyOrder] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const keyboardRefQ = useRef(null);
    const keyboardRefB = useRef(null);

    const onKeyboardChange = (input) => {
        if (keyboardInput === 'quantity') {
            setQuantity(input);
        } else if (keyboardInput === 'brand') {
            setBrand(input);
        }
    };

    const onKeyPress = (button) => {
        if (button === '{enter}') {
            handleAddOrUpdateOrder();
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
            setKeyboardInput('quantity');
            setShowKeyOrder(false);
            if (keyboardRefQ.current && keyboardRefB.current) {
                keyboardRefB.current.setInput('');
                keyboardRefQ.current.setInput('');
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
        setKeyboardInput('quantity'); // Start with quantity input focused
    };

    const handleDelete = (index) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            setOrderItems((prevItems) => prevItems.filter((_, i) => i !== index));
        }
    };

    const handleBrandFocus = () => {
        setKeyboardInput('brand');
        if (keyboardRefB.current) {
            keyboardRefB.current.setInput(brand || '');
        }
    };

    const handleQuantityFocus = () => {
        setKeyboardInput('quantity');
        if (keyboardRefQ.current) {
            keyboardRefQ.current.setInput(quantity || '');
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
        // Red Palette
        [
            { name: 'Red', value: '#FF0000' },
            { name: 'Red Light 1', value: '#FF756B' },
            { name: 'Red Light 2', value: '#FFB2AC' },
            { name: 'Red Light 3', value: '#FFD5D2' }
        ],
        // Blue Palette
        [
            { name: 'Blue', value: '#0000FF' },
            { name: 'Blue Light 1', value: '#4D4DFF' },
            { name: 'Blue Light 2', value: '#9999FF' },
            { name: 'Blue Light 3', value: '#CCCCFF' }
        ],
        // Green Palette
        [
            { name: 'Green', value: '#00FF00' },
            { name: 'Green Light 1', value: '#66FF66' },
            { name: 'Green Light 2', value: '#99FF99' },
            { name: 'Green Light 3', value: '#CCFFCC' }
        ],
        // Black Palette
        [
            { name: 'Black', value: '#000000' },
            { name: 'Black Shade 1', value: '#333333' },
            { name: 'Black Shade 2', value: '#666666' },
            { name: 'Black Shade 3', value: '#999999' }
        ],
        // White Palette
        [
            { name: 'White', value: '#FFFFFF' },
            { name: 'White Shade 1', value: '#F5F5F5' },
            { name: 'White Shade 2', value: '#ECECEC' },
            { name: 'White Shade 3', value: '#E0E0E0' }
        ],
        // Yellow Palette
        [
            { name: 'Yellow', value: '#FFFF00' },
            { name: 'Yellow Light 1', value: '#FFFF66' },
            { name: 'Yellow Light 2', value: '#FFFF99' },
            { name: 'Yellow Light 3', value: '#FFFFCC' }
        ],
        // Purple Palette
        [
            { name: 'Purple', value: '#800080' },
            { name: 'Purple Light 1', value: '#993399' },
            { name: 'Purple Light 2', value: '#CC99CC' },
            { name: 'Purple Light 3', value: '#E6CCE6' }
        ],
        // Orange Palette
        [
            { name: 'Orange', value: '#FFA500' },
            { name: 'Orange Light 1', value: '#FFBB33' },
            { name: 'Orange Light 2', value: '#FFCC66' },
            { name: 'Orange Light 3', value: '#FFDD99' }
        ],
        // Pink Palette
        [
            { name: 'Pink', value: '#FFC1CC' },
            { name: 'Pink Light 1', value: '#FFD1DC' },
            { name: 'Pink Light 2', value: '#FFE6EB' },
            { name: 'Pink Dark 1', value: '#FF99AA' }
        ],
        // Gray Palette
        [
            { name: 'Gray', value: '#808080' },
            { name: 'Gray Light 1', value: '#A9A9A9' },
            { name: 'Gray Light 2', value: '#D3D3D3' },
            { name: 'Gray Dark 1', value: '#696969' }
        ],
        // Cyan Palette
        [
            { name: 'Cyan', value: '#00FFFF' },
            { name: 'Cyan Light 1', value: '#66FFFF' },
            { name: 'Cyan Light 2', value: '#99FFFF' },
            { name: 'Cyan Light 3', value: '#CCFFFF' }
        ],
        // Magenta Palette
        [
            { name: 'Magenta', value: '#FF00FF' },
            { name: 'Magenta Light 1', value: '#FF66FF' },
            { name: 'Magenta Light 2', value: '#FF99FF' },
            { name: 'Magenta Light 3', value: '#FFCCFF' }
        ]
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
                                        if (keyboardRefQ.current && keyboardRefB.current) {
                                            keyboardRefQ.current.setInput('');
                                            keyboardRefB.current.setInput('');
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
                            <div className="keyboard-container">
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
                                {keyboardInput === 'quantity' && (
                                    <VirtualKeyboard
                                        keyboardRef={keyboardRefQ}
                                        onChange={onKeyboardChange}
                                        onKeyPress={onKeyPress}
                                        inputName="quantity"
                                        initialLayout="numeric"
                                        initialValue={quantity} // Pass the current quantity value
                                    />
                                )}
                                {keyboardInput === 'brand' && (
                                    <VirtualKeyboard
                                        keyboardRef={keyboardRefB}
                                        onChange={onKeyboardChange}
                                        onKeyPress={onKeyPress}
                                        inputName="brand"
                                        initialLayout="alphanumeric"
                                        initialValue={brand} // Pass the current brand value
                                    />
                                )}
                            </div>
                            <div className="order-detail">
                                <label className="label">Services</label>
                                <div className="service-grid">
                                    {services?.map((service) => (
                                        <button
                                            key={service.id}
                                            onClick={() => {
                                                setSelectedService(service.id);
                                                if (keyboardRefQ.current && keyboardInput === 'quantity') {
                                                    keyboardRefQ.current.setInput('');
                                                }
                                                if (keyboardRefB.current && keyboardInput === 'brand') {
                                                    keyboardRefB.current.setInput('');
                                                }
                                            }}
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
                                                        onClick={() => {
                                                            if (selectedArticle) setSelectedColor(color.name);
                                                        }}
                                                        disabled={!selectedArticle}
                                                        className={`color-swatch ${selectedColor === color.name && selectedArticle ? 'color-swatch-selected' : ''} ${!selectedArticle ? 'color-swatch-disabled' : ''}`}
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
                                        setKeyboardInput('quantity');
                                        setBrand('');
                                        setSelectedColor('');
                                        setShowKeyOrder(false);
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