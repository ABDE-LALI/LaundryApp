import Dashboard from "../Dashboard";
import React, { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import VirtualKeyboard from '../../Components/VirtualKeyboard';
import Ordersvalidation from "@/Components/Ordersvalidation";
import OrderSummary from '@/Components/OrderSummary';

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
    const [activeInputOrder, setActiveInputOrder] = useState(null);
    const [activeInputConfirm, setActiveInputConfirm] = useState(null);
    const [keyboardLayoutOrder, setKeyboardLayoutOrder] = useState('numeric');
    const [keyboardLayoutConfirm, setKeyboardLayoutConfirm] = useState('numeric');
    const keyboardRefOrder = useRef(null);
    const keyboardRefConfirm = useRef(null);
    const [billstatus, setBillPaymentStatus] = useState('unpaid');
    const [ordersconf, setOrdersConf] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [showValidateConfirm, setShowValidateConfirm] = useState(false);
    const [notification, setNotification] = useState(null); // New state for notifications

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

    // Handlers
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
            setNotification({ type: 'error', message: 'Erreur lors de la récupération du prix de l\'article.' });
            setTimeout(() => setNotification(null), 3000); // Auto-dismiss after 3 seconds
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
        setDeleteIndex(index);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setOrderItems((prevItems) => prevItems.filter((_, i) => i !== deleteIndex));
        setShowDeleteConfirm(false);
        setDeleteIndex(null);
    };

    const valider = () => {
        if (orderItems.length === 0) return;
        setShowValidateConfirm(true);
    };

    const confirmValidate = () => {
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
                                setShowValidateConfirm(false);
                                setNotification({ type: 'success', message: 'Commandes soumises avec succès !' });
                                setTimeout(() => setNotification(null), 3000);
                                handlePrintTicket(); // Auto-dismiss
                            },
                            onError: (errors) => {
                                console.error(errors);
                                setNotification({ type: 'error', message: 'Erreur lors de la soumission des commandes.' });
                                setTimeout(() => setNotification(null), 3000); // Auto-dismiss
                            },
                        }
                    );
                },
                onError: (errors) => {
                    console.error(errors);
                    setNotification({ type: 'error', message: 'Erreur lors de la création du ticket.' });
                    setTimeout(() => setNotification(null), 3000); // Auto-dismiss
                },
            }
        );
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

    // Styled Confirmation Dialog Component
    const ConfirmationDialog = ({ message, onConfirm, onCancel }) => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100 hover:scale-[1.01]">
                <p className="text-gray-700 mb-4 text-center font-medium">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
                    >
                        Oui
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700 transition-all duration-200"
                    >
                        Non
                    </button>
                </div>
            </div>
        </div>
    );

    // Styled Notification Component
    const Notification = ({ type, message }) => (
        <div className="fixed top-4 right-4 z-70">
            <div
                className={`p-4 rounded-lg shadow-lg text-white flex items-center gap-2 animate-fade-in ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}
            >
                <span className="text-lg">
                    {type === 'success' ? '✅' : '❌'}
                </span>
                <p className="font-medium">{message}</p>
            </div>
        </div>
    );
    const handlePrintTicket = () => {
            window.print();
    };

    return (
        <Dashboard>
            <div className="p-6 pb-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-gray-800">Prendre Commandes</h2>
                </div>

                <div className="flex gap-1">
                    {/* Article Selection */}
                    <div className="flex flex-1 gap-2">
                        <div className= " shadow-md rounded-lg border border-gray-200 articles-grid w-3/5">
                            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-2 ">
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
                                        className={` bg-white p-4 shadow-md rounded-lg border ${selectedArticle === article.id ? 'border-green-500' : 'border-gray-200'} hover:shadow-lg transition-shadow`}
                                    >
                                        <div className=" flex flex-col items-center">
                                            <img
                                                src={`/storage/${article.image}`}
                                                alt={article.name}
                                                className="object-cover rounded-md mb-2"
                                            />
                                            <span className="text-sm font-medium text-gray-700">{article.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Order Details Window */}

                        {/* Order Summary */}
                        <div className="w-3/6">
                            <OrderSummary
                                orderItems={orderItems}
                                ticketId={ticket_id}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                setOrdersConf={setOrdersConf}
                            />
                        </div>
                    </div>
                    {showkeyorder && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
                            <div className="bg-white p-8 rounded-xl shadow-2xl h-[80vh] max-h-[90vh] max-w-[90vw] overflow-auto transform transition-all duration-300 scale-100 hover:scale-[1.01]">
                                <div className="flex flex-col md:flex-row">
                                    {/* Left Section */}
                                    <div className="w-full md:w-1/2 pr-0 md:pr-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité</label>
                                            <input
                                                type="text"
                                                value={quantity}
                                                onFocus={handleQuantityFocus}
                                                placeholder="Entrez la quantité"
                                                // readOnly
                                                readOnly
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Marque</label>
                                            <input
                                                type="text"
                                                value={brand}
                                                onFocus={handleBrandFocus}
                                                placeholder="Entrez la marque"
                                                readOnly
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
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
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                                            {editingIndex !== null ? 'Modifier la Commande' : 'Ajouter une Commande'}
                                        </h3>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Services</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {services?.map((service) => (
                                                    <button
                                                        key={service.id}
                                                        onClick={() => setSelectedService(service.id)}
                                                        className={`p-4 rounded-lg shadow-md border ${selectedService === service.id ? 'border-green-500 bg-green-200' : 'border-gray-200'} hover:shadow-lg hover:border-green-400 transition-all duration-200`}
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
                                        <div className="mt-6">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Couleur</h4>
                                            <div className="flex overflow-x-auto gap-1 pb-2 scrollbar-hidden snap-x snap-mandatory">
                                                {colorOptions.map((colorGroup, index) => (
                                                    <div key={index} className="p-1 flex justify-center shrink-0">
                                                        {colorGroup.map((color) => (
                                                            <button
                                                                key={color.name}
                                                                onClick={() => setSelectedColor(color.name)}
                                                                className={`w-10 h-10 rounded-full border-2 ${selectedColor === color.name ? 'border-green-500 scale-110' : 'border-gray-300'} hover:border-green-400 transition-all duration-200`}
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
                                        <div className="flex justify-end gap-4 mt-6">
                                            <button
                                                onClick={handleAddOrUpdateOrder}
                                                disabled={!selectedArticle || !selectedService || !quantity}
                                                className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
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

                    {/* Confirmation Modals */}
                    {showDeleteConfirm && (
                        <ConfirmationDialog
                            message="Êtes-vous sûr de vouloir supprimer cette commande ?"
                            onConfirm={confirmDelete}
                            onCancel={() => setShowDeleteConfirm(false)}
                        />
                    )}
                    {showValidateConfirm && (
                        <ConfirmationDialog
                            message="Êtes-vous sûr de vouloir valider ces commandes ?"
                            onConfirm={confirmValidate}
                            onCancel={() => setShowValidateConfirm(false)}
                        />
                    )}
                    {ordersconf && (
                        <Ordersvalidation
                            orderId={ticket_id}
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
                            orderItems={orderItems}
                            handlePrintTicket={handlePrintTicket}
                        />
                    )}

                    {/* Notification */}
                    {notification && (
                        <Notification type={notification.type} message={notification.message} />
                    )}
                </div>
            </div>
        </Dashboard>
    );
}