import { RightSideBar } from "@/src/Fragments/RightSideBar";
import Dashboard from "../Dashboard";
import React, { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import VirtualKeyboard from '../../Components/VirtualKeyboard';
import Ordersvalidation from "@/Components/Ordersvalidation";
import OrderSummary from '@/Components/OrderSummary';

export default function Create() {
    const { articles, services, ticket_id } = usePage().props;

    // State declarations (unchanged)
    const [selectedArticle, setSelectedArticle] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [showkeyorder, setShowKeyOrder] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [brand, setBrand] = useState('');
    const [paidAmount, setPaidAmount] = useState(0);
    const [activeInputOrder, setActiveInputOrder] = useState(null);
    const [activeInputConfirm, setActiveInputConfirm] = useState(null);
    const [keyboardLayoutOrder, setKeyboardLayoutOrder] = useState('numeric');
    const [keyboardLayoutConfirm, setKeyboardLayoutConfirm] = useState('numeric');
    const keyboardRefOrder = useRef(null);
    const keyboardRefConfirm = useRef(null);
    const [billstatus, setBillPaymentStatus] = useState('unpaid');
    const [ordersconf, setOrdersConf] = useState(false);

    // Color options (unchanged)
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

    // Handlers (unchanged, only styling added below)
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

    const onKeyboardChangeConfirm = (inputs) => {
        if (activeInputConfirm === 'paid_amount') {
            const value = inputs['paid_amount'] || '';
            if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                setPaidAmount(value);
            }
        }
    };

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

    const handlePaidAmountFocus = () => {
        setActiveInputConfirm('paid_amount');
        setKeyboardLayoutConfirm('numeric');
        if (keyboardRefConfirm.current) {
            keyboardRefConfirm.current.setInput(paidAmount, 'paid_amount');
        }
    };

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

    const handleDelete = (index) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            setOrderItems((prevItems) => prevItems.filter((_, i) => i !== index));
        }
    };

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
                    payment_status: (total_price <= parseFloat(paidAmount)) ? "paid" : billstatus,
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
                                    setBillPaymentStatus('unpaid');
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

    const totalBillPrice = orderItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

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
        return () => document.removeEventListener('mousedown', handleClickOutsideOrder);
    }, []);

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
        return () => document.removeEventListener('mousedown', handleClickOutsideConfirm);
    }, []);

    return (
        <Dashboard>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Prendre Commandes</h2>
                </div>

                <div className="flex gap-2 space-y-6">
                    {/* Article Selection */}
                    <div className="w-2/3">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Articles</h3>
                        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-2">
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
                                    className={`bg-white p-4 shadow-md rounded-lg border ${selectedArticle === article.id ? 'border-blue-500' : 'border-gray-200'} hover:shadow-lg transition-shadow`}
                                >
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={`/storage/${article.image}`}
                                            alt={article.name}
                                            className=" object-cover rounded-md mb-2"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{article.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Order Details Window */}
                    {showkeyorder && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
                            <div className="bg-white p-8 rounded-xl shadow-2xl h-[80vh] max-h-[90vh] max-w-[90vw] overflow-auto transform transition-all duration-300 scale-100 hover:scale-[1.01]">
                                <div className="flex flex-col md:flex-row">
                                    {/* Left Section */}
                                    <div className="w-full md:w-1/2 pr-0 md:pr-4">
                                        {/* Quantity */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité</label>
                                            <input
                                                type="text"
                                                value={quantity}
                                                onFocus={handleQuantityFocus}
                                                placeholder="Entrez la quantité"
                                                readOnly
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        {/* Brand */}
                                        <div className="mt-4">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Marque</label>
                                            <input
                                                type="text"
                                                value={brand}
                                                onFocus={handleBrandFocus}
                                                placeholder="Entrez la marque"
                                                readOnly
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        {/* Virtual Keyboard */}
                                        <div ref={orderKeyboardContainerRef} className="mt-4 h-150 max-h-150[px] overflow-auto">
                                            <VirtualKeyboard
                                                keyboardRef={keyboardRefOrder}
                                                onChangeAll={onKeyboardChangeOrder}
                                                initialLayout={keyboardLayoutOrder}
                                                inputName={activeInputOrder}
                                            />
                                        </div>
                                    </div>

                                    {/* Right Section */}
                                    <div className="w-full md:w-1/2 mt-6 md:mt-0">
                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                                            {editingIndex !== null ? 'Modifier la Commande' : 'Ajouter une Commande'}
                                        </h3>

                                        {/* Services */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Services</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {services?.map((service) => (
                                                    <button
                                                        key={service.id}
                                                        onClick={() => setSelectedService(service.id)}
                                                        className={`bg-white p-4 rounded-lg shadow-md border ${selectedService === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                                            } hover:shadow-lg hover:border-blue-400 transition-all duration-200`}
                                                    >
                                                        <img
                                                            src={`/storage/${service.image}`}
                                                            alt={service.name}
                                                            className="w-8 h-8 object-cover rounded-md mb-2 mx-auto"
                                                        />
                                                        <span className="block text-sm font-medium text-gray-700">{service.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Colors */}
                                        <div className="mt-6">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Couleur</h4>
                                            <div className="flex overflow-x-auto gap-1 pb-2 scrollbar-hidden snap-x snap-mandatory">
                                                {colorOptions.map((colorGroup, index) => (
                                                    <div key={index} className="flex justify-center shrink-0">
                                                        {colorGroup.map((color) => (
                                                            <button
                                                                key={color.name}
                                                                onClick={() => setSelectedColor(color.name)}
                                                                className={`w-10 h-10 rounded-full border-2 ${selectedColor === color.name ? 'border-blue-500 scale-110' : 'border-gray-300'
                                                                    } hover:border-blue-400 transition-all duration-200`}
                                                                style={{ backgroundColor: color.value }}
                                                                title={color.name}
                                                            />
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="mt-3 text-sm text-gray-600">
                                                Couleur sélectionnée: <span className="font-medium">{selectedColor || 'Aucune'}</span>
                                            </p>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-end gap-4 mt-6">
                                            <button
                                                onClick={handleAddOrUpdateOrder}
                                                disabled={!selectedArticle || !selectedService || !quantity}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                                            >
                                                {editingIndex !== null ? 'Modifier' : 'Ajouter'}
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
                                                className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all duration-200"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="w-3/4">
                        <OrderSummary
                            orderItems={orderItems}
                            ticketId={ticket_id}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            setOrdersConf={setOrdersConf}
                        />
                    </div>

                    {/* Confirmation Modal */}
                    {ordersconf && (
                        <Ordersvalidation
                            totalBillPrice={totalBillPrice}
                            billstatus={billstatus}
                            setBillPaymentStatus={setBillPaymentStatus}
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