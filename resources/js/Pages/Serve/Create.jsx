import { RightSideBar } from "@/src/Fragments/RightSideBar";
import Dashboard from "../Dashboard";
import React, { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import VirtualKeyboard from '../../Components/VirtualKeyboard';
import Ordersvalidation from "@/Components/Ordersvalidation";
import OrderSummary from '@/Components/OrderSummary'; // Import the new OrderSummary component

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
    const [paidAmount, setPaidAmount] = useState(0);
    const [activeInputOrder, setActiveInputOrder] = useState(null); // For order details window
    const [activeInputConfirm, setActiveInputConfirm] = useState(null); // For confirmation modal
    const [keyboardLayoutOrder, setKeyboardLayoutOrder] = useState('numeric'); // For order details window
    const [keyboardLayoutConfirm, setKeyboardLayoutConfirm] = useState('numeric'); // For confirmation modal
    const keyboardRefOrder = useRef(null); // For order details window
    const keyboardRefConfirm = useRef(null); // For confirmation modal
    const [billstatus, setBillStatus] = useState('unpaid');
    const [ordersconf, setOrdersConf] = useState(false);

    // Color options (culturally inspired)
    const colorOptions = [
        [{ name: 'Ḥamra', value: '#C1272D' }],
        [{ name: 'Ḥamra Mġlqa', value: '#800000' }],
        [{ name: 'Bordu', value: '#800020' }],
        [{ name: 'Kḍra', value: '#006233' }],
        [{ name: 'Kḍra Fatiḥa', value: '#00FF00' }],
        [{ name: 'Zaytouni', value: '#808000' }],
        [{ name: 'Zumurrudi', value: '#50C878' }],
        [{ name: 'Zrq', value: '#4682B4' }],
        [{ name: 'Zrq Gamiq', value: '#000080' }],
        [{ name: 'Bloumarin', value: '#003366' }],
        [{ name: 'Zrq Kḍra', value: '#008080' }],
        [{ name: 'Smawi', value: '#00FFFF' }],
        [{ name: 'Biyḍa', value: '#FFFFFF' }],
        [{ name: 'Rmadi', value: '#808080' }],
        [{ name: 'Kḥal', value: '#000000' }],
        [{ name: 'Ṣfṛa', value: '#FFD700' }],
        [{ name: 'Dhahabi', value: '#DAA520' }],
        [{ name: 'Fiḍḍi', value: '#C0C0C0' }],
        [{ name: 'Lmuni', value: '#FFA500' }],
        [{ name: 'Lmuni Mġlq', value: '#FF8C00' }],
        [{ name: 'Khukhi', value: '#FFDAB9' }],
        [{ name: 'Wardiyya', value: '#FF69B4' }],
        [{ name: 'Wardiyya Fatiḥa', value: '#FFC0CB' }],
        [{ name: 'Banafsaji', value: '#800080' }],
        [{ name: 'Banafsaji Mġlq', value: '#4B0082' }],
        [{ name: 'Fanidi', value: '#FF00FF' }],
        [{ name: 'Qahwi', value: '#8B4513' }],
        [{ name: 'Bej', value: '#F5F5DC' }],
        [{ name: 'Turkuzi', value: '#40E0D0' }],
        [{ name: 'Lavanda', value: '#E6E6FA' }],
        [{ name: 'Rmadi Mġlq', value: '#505050' }],
        [{ name: 'Rmadi Fatiḥ', value: '#D3D3D3' }],
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
                    paid_amount: total_price <= parseFloat(paidAmount) ? total_price : parseFloat(paidAmount) || 0,
                    payment_status:(total_price <= parseFloat(paidAmount)) ? "paid" : billstatus,
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
                                    setBillStatus('unpaid');
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

                    {/* Order Summary - Replaced with OrderSummary Component */}
                    <OrderSummary
                        orderItems={orderItems}
                        ticketId={ticket_id}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        setOrdersConf={setOrdersConf}
                    />

                    {/* Confirmation Modal */}
                    {ordersconf && (
                        <Ordersvalidation
                            totalBillPrice={totalBillPrice}
                            billstatus={billstatus}
                            setBillStatus={setBillStatus}
                            paidAmount={paidAmount}
                            setPaidAmount={setPaidAmount}
                            valider={valider}
                            setOrdersConf={setOrdersConf}
                            setActiveInputConfirm={setActiveInputConfirm}
                            handlePaidAmountFocus={handlePaidAmountFocus}
                            onKeyboardChangeConfirm={onKeyboardChangeConfirm}
                            keyboardRefConfirm={keyboardRefConfirm}
                            keyboardLayoutConfirm={keyboardLayoutConfirm}
                            activeInputConfirm={activeInputConfirm}
                            confirmKeyboardContainerRef={confirmKeyboardContainerRef}
                        />
                    )}
                </div>
            </div>
        </Dashboard>
    );
}