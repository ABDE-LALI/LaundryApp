import { RightSideBar } from "@/src/Fragments/RightSideBar";
import Dashboard from "../Dashboard";
import React, { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import VirtualKeyboard from '../../Components/VirtualKeyboard';

export default function Create() {
    const { articles, services, ticket_id } = usePage().props;

    // State declarations
    const [selectedArticle, setSelectedArticle] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [showkeyorder, setShowKeyOrder] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [brand, setBrand] = useState('');
    const [paidAmount, setPaidAmount] = useState('');
    const [activeInputOrder, setActiveInputOrder] = useState(null); // For order details window
    const [activeInputConfirm, setActiveInputConfirm] = useState(null); // For confirmation modal
    const [keyboardLayoutOrder, setKeyboardLayoutOrder] = useState('numeric'); // For order details window
    const [keyboardLayoutConfirm, setKeyboardLayoutConfirm] = useState('numeric'); // For confirmation modal
    const keyboardRefOrder = useRef(null); // For order details window
    const keyboardRefConfirm = useRef(null); // For confirmation modal
    const [billstatus, setBillStatus] = useState(0);
    const [ordersconf, setOrdersConf] = useState(false);

    // Color options (culturally inspired)
    const colorOptions = [
        // Red (from the Moroccan flag, symbolizing bravery and strength)
        [{ name: 'Ḥamra', value: '#C1272D' }], // Red in Darija
        // Dark Red (inspired by Berber carpets)
        [{ name: 'Ḥamra Mġlqa', value: '#800000' }], // Dark Red in Darija
        // Burgundy (inspired by Moroccan wine and textiles)
        [{ name: 'Bordu', value: '#800020' }], // Burgundy in Darija
        // Green (from the Moroccan flag, symbolizing joy, peace, and Islam)
        [{ name: 'Kḍra', value: '#006233' }], // Green in Darija
        // Light Green (inspired by date palm oases)
        [{ name: 'Kḍra Fatiḥa', value: '#00FF00' }], // Light Green in Darija
        // Olive (inspired by Moroccan olive groves)
        [{ name: 'Zaytouni', value: '#808000' }], // Olive Green in Darija
        // Emerald Green (Moroccan precious stones)
        [{ name: 'Zumurrudi', value: '#50C878' }], // Emerald Green in Darija
        // Blue (inspired by Chefchaouen, the Blue City)
        [{ name: 'Zrq', value: '#4682B4' }], // Blue in Darija
        // Navy Blue (deep ocean and Moroccan sky)
        [{ name: 'Zrq Gamiq', value: '#000080' }], // Navy in Darija
        // Deep Marine Blue
        [{ name: 'Bloumarin', value: '#003366' }], // Deep Marine Blue in Darija
        // Teal (Essaouira’s boats)
        [{ name: 'Zrq Kḍra', value: '#008080' }], // Teal in Darija
        // Cyan (inspired by the Mediterranean coast)
        [{ name: 'Smawi', value: '#00FFFF' }], // Cyan in Darija
        // White (Casablanca, the White City)
        [{ name: 'Biyḍa', value: '#FFFFFF' }], // White in Darija
        // Gray (Atlas Mountains and rocky landscapes)
        [{ name: 'Rmadi', value: '#808080' }], // Gray in Darija
        // Black (dark stones of the Atlas Mountains)
        [{ name: 'Kḥal', value: '#000000' }], // Black in Darija
        // Yellow (golden sands of the Sahara)
        [{ name: 'Ṣfṛa', value: '#FFD700' }], // Yellow in Darija
        // Gold (Moroccan décor)
        [{ name: 'Dhahabi', value: '#DAA520' }], // Gold in Darija
        // Silver (traditional Moroccan jewelry)
        [{ name: 'Fiḍḍi', value: '#C0C0C0' }], // Silver in Darija
        // Orange (Moroccan oranges and sunsets)
        [{ name: 'Lmuni', value: '#FFA500' }], // Orange in Darija
        // Dark Orange (burnt orange of Moroccan spices)
        [{ name: 'Lmuni Mġlq', value: '#FF8C00' }], // Dark Orange in Darija
        // Peach (soft Moroccan clay walls)
        [{ name: 'Khukhi', value: '#FFDAB9' }], // Peach in Darija
        // Pink (Marrakech, the Rose City)
        [{ name: 'Wardiyya', value: '#FF69B4' }], // Pink in Darija
        // Soft Pink (Moroccan blush tones)
        [{ name: 'Wardiyya Fatiḥa', value: '#FFC0CB' }], // Light Pink in Darija
        // Purple (Moroccan textiles)
        [{ name: 'Banafsaji', value: '#800080' }], // Purple in Darija
        // Dark Purple (inspired by Moroccan dye)
        [{ name: 'Banafsaji Mġlq', value: '#4B0082' }], // Dark Purple in Darija
        // Fanidi (replacing Magenta, inspired by Moroccan vibrant fabrics)
        [{ name: 'Fanidi', value: '#FF00FF' }], // Magenta (Fanidi in Darija)
        // Brown (terracotta kasbahs and Moroccan earth)
        [{ name: 'Qahwi', value: '#8B4513' }], // Brown in Darija
        // Beige (desert dunes and Moroccan architecture)
        [{ name: 'Bej', value: '#F5F5DC' }], // Beige in Darija
        // Turquoise (Tafilalt oases and Moroccan tiles)
        [{ name: 'Turkuzi', value: '#40E0D0' }], // Turquoise in Darija
        // Lavender (Moroccan flower fields)
        [{ name: 'Lavanda', value: '#E6E6FA' }], // Lavender in Darija
        // Dark Gray (inspired by Moroccan basalt stones)
        [{ name: 'Rmadi Mġlq', value: '#505050' }], // Dark Gray in Darija
        // Light Gray (soft Moroccan limestone)
        [{ name: 'Rmadi Fatiḥ', value: '#D3D3D3' }], // Light Gray in Darija
    ];

    // Handle virtual keyboard input for order details window (Quantity, Brand)
    const onKeyboardChangeOrder = (inputs) => {
        if (activeInputOrder === 'quantity') {
            const value = inputs['quantity'] || '';
            if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                setQuantity(value);
            }
        } else if (activeInputOrder === 'brand') {
            setBrand(inputs['brand'] || '');
        }
    };

    // Handle virtual keyboard input for confirmation modal (Paid Amount)
    const onKeyboardChangeConfirm = (inputs) => {
        if (activeInputConfirm === 'paid_amount') {
            const value = inputs['paid_amount'] || '';
            if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                setPaidAmount(value);
            }
        }
    };

    // Focus handlers for order details window
    const handleQuantityFocus = () => {
        setActiveInputOrder('quantity');
        setKeyboardLayoutOrder('numeric');
        if (keyboardRefOrder.current) {
            keyboardRefOrder.current.setInput(quantity, 'quantity');
        }
    };

    const handleBrandFocus = () => {
        setActiveInputOrder('brand');
        setKeyboardLayoutOrder('alphanumeric');
        if (keyboardRefOrder.current) {
            keyboardRefOrder.current.setInput(brand, 'brand');
        }
    };

    // Focus handler for confirmation modal
    const handlePaidAmountFocus = () => {
        setActiveInputConfirm('paid_amount');
        setKeyboardLayoutConfirm('numeric');
        if (keyboardRefConfirm.current) {
            keyboardRefConfirm.current.setInput(paidAmount, 'paid_amount');
        }
    };

    // Add or update order item
    const handleAddOrUpdateOrder = async () => {
        if (!selectedArticle || !selectedService || !quantity) return;

        const selectedArticleObj = articles.find((a) => a.id === parseInt(selectedArticle));
        const selectedServiceObj = services.find((s) => s.id === parseInt(selectedService));
        if (!selectedArticleObj || !selectedServiceObj) return;

        try {
            const response = await axios.get(route('serve.getArticleServicePrice', {
                article_id: selectedArticleObj.id,
                service_id: selectedServiceObj.id
            }));
            const price = response.data.price;
            const updatedArticleObj = { ...selectedArticleObj, price };
            const item = {
                article: updatedArticleObj,
                service: selectedServiceObj,
                totalPrice: price * parseFloat(quantity),
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

            // Reset form
            setSelectedArticle('');
            setSelectedService('');
            setQuantity('');
            setBrand('');
            setSelectedColor('');
            setShowKeyOrder(false);
            setActiveInputOrder(null);
            if (keyboardRefOrder.current) {
                keyboardRefOrder.current.setInput('', 'quantity');
                keyboardRefOrder.current.setInput('', 'brand');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la récupération du prix de l\'article.');
        }
    };

    // Edit an order item
    const handleEdit = (index) => {
        const item = orderItems[index];
        setSelectedArticle(item.article.id);
        setSelectedService(item.service.id);
        setQuantity(item.quantity.toString());
        setBrand(item.brand);
        setSelectedColor(item.color);
        setEditingIndex(index);
        setShowKeyOrder(true);
        setKeyboardLayoutOrder('numeric');
        if (keyboardRefOrder.current) {
            keyboardRefOrder.current.setInput(item.quantity.toString(), 'quantity');
            keyboardRefOrder.current.setInput(item.brand, 'brand');
        }
    };

    // Delete an order item
    const handleDelete = (index) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            setOrderItems((prevItems) => prevItems.filter((_, i) => i !== index));
        }
    };

    // Submit the order
    const valider = () => {
        if (orderItems.length === 0) return;

        if (window.confirm('Êtes-vous sûr de vouloir valider ces commandes ?')) {
            const data = orderItems.map((item) => ({
                ticket_id: ticket_id,
                article_id: item.article.id,
                service_id: item.service.id,
                price: item.article.price,
                quantity: item.quantity,
                brand: item.brand,
                color: item.color,
            }));
            const total_price = data.reduce((acc, item) => acc + item.price * item.quantity, 0);

            router.post(
                route('serve.ticket.store'),
                {
                    quantity: data.reduce((acc, item) => acc + item.quantity, 0),
                    total_price: total_price,
                    paid_amount: parseFloat(paidAmount) || 0,
                    status: billstatus,
                },
                {
                    onSuccess: () => {
                        router.post(
                            route('serve.store'),
                            { items: data },
                            {
                                onSuccess: () => {
                                    setOrderItems([]);
                                    setPaidAmount('');
                                    setBillStatus(0);
                                    setOrdersConf(false);
                                    setActiveInputConfirm(null);
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
    };

    // Compute total price dynamically
    const totalBillPrice = orderItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
    const rest = totalBillPrice - (parseFloat(paidAmount) || 0);

    // Handle click outside for order details window
    const orderKeyboardContainerRef = useRef(null);
    useEffect(() => {
        const handleClickOutsideOrder = (event) => {
            if (
                orderKeyboardContainerRef.current &&
                !orderKeyboardContainerRef.current.contains(event.target) &&
                !event.target.closest('input')
            ) {
                setActiveInputOrder(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideOrder);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideOrder);
        };
    }, []);

    // Handle click outside for confirmation modal
    const confirmKeyboardContainerRef = useRef(null);
    useEffect(() => {
        const handleClickOutsideConfirm = (event) => {
            if (
                confirmKeyboardContainerRef.current &&
                !confirmKeyboardContainerRef.current.contains(event.target) &&
                !event.target.closest('input')
            ) {
                setActiveInputConfirm(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideConfirm);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideConfirm);
        };
    }, []);

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
                                        setKeyboardLayoutOrder('numeric');
                                        setActiveInputOrder('quantity');
                                        if (keyboardRefOrder.current) {
                                            keyboardRefOrder.current.setInput('', 'quantity');
                                            keyboardRefOrder.current.setInput('', 'brand');
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

                    {/* Order Details Window */}
                    {showkeyorder && (
                        <div className="keyboard-order">
                            <div>
                                <input
                                    type="text"
                                    value={quantity}
                                    onFocus={handleQuantityFocus}
                                    placeholder="Quantity"
                                    readOnly
                                />
                                <input
                                    type="text"
                                    value={brand}
                                    onFocus={handleBrandFocus}
                                    placeholder="Brand"
                                    readOnly
                                />
                                {/* Virtual Keyboard for Order Details */}
                                    <div className="virtual-keyboard-container" ref={orderKeyboardContainerRef}>
                                        <VirtualKeyboard
                                            keyboardRef={keyboardRefOrder}
                                            onChangeAll={onKeyboardChangeOrder}
                                            initialLayout={keyboardLayoutOrder}
                                            inputName={activeInputOrder}
                                        />
                                    </div>
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
                                        setActiveInputOrder(null);
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
                                                {item.totalPrice ? `${item.totalPrice.toFixed(2)} DH` : 'N/A'}
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
                            <button onClick={() => setOrdersConf(true)} disabled={orderItems.length === 0}>Confirm</button>
                        </div>
                    </div>

                    {/* Confirmation Modal */}
                    {ordersconf && (
                        <div className="orders-confirmation">
                            <div className="modal-content">
                                <strong>Total Price: {totalBillPrice.toFixed(2)} DH</strong><br />
                                <label>Bill Status: </label>
                                <select value={billstatus} onChange={(e) => setBillStatus(e.target.value)}>
                                    <option value='1'>Non Payé</option>
                                    <option value="2">Payé</option>
                                    <option value="0">Paye quelque</option>
                                </select><br />
                                {(Number(billstatus)== 0)&&<><label>Paid Amount: </label>
                                <input
                                    type="text"
                                    value={paidAmount}
                                    onFocus={handlePaidAmountFocus}
                                    readOnly
                                    name="paid_amount"
                                    id="paid_amount"
                                    placeholder="Enter paid amount"
                                /></>}<br />
                                {/* Virtual Keyboard for Confirmation Modal */}
                                    <div className="virtual-keyboard-container" ref={confirmKeyboardContainerRef}>
                                        <VirtualKeyboard
                                            keyboardRef={keyboardRefConfirm}
                                            onChangeAll={onKeyboardChangeConfirm}
                                            initialLayout={keyboardLayoutConfirm}
                                            inputName={activeInputConfirm}
                                        />
                                    </div>
                                <strong>Rest: {rest.toFixed(2)} DH</strong><br />
                                <button className="bg-green-400 p-1 mt-2" onClick={valider}>Valider</button>
                                <button
                                    className="bg-red-400 p-1 mt-2 ml-2"
                                    onClick={() => {
                                        setOrdersConf(false);
                                        setPaidAmount('');
                                        setBillStatus(0);
                                        setActiveInputConfirm(null);
                                    }}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Dashboard>
    );
}