import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import VirtualKeyboard from '@/Components/VirtualKeyboard';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'test@test.com',
        password: '',
    });

    const [showKeyboard, setShowKeyboard] = useState(false);
    const [keyboardLayout, setKeyboardLayout] = useState('numeric');
    const keyboardRef = useRef(null);
    const passwordInputRef = useRef(null);
    const keyboardContainerRef = useRef(null);

    const onKeyboardChange = (inputs) => {
        const value = inputs['password'] || '';
        if (value === '' || /^[0-9]*$/.test(value)) {
            setData('password', value);
        }
    };

    const handlePasswordFocus = () => {
        setShowKeyboard(true);
        setKeyboardLayout('numeric');
        if (keyboardRef.current) {
            keyboardRef.current.setInput(data.password, 'password');
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9]*$/.test(value)) {
            setData('password', value);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                keyboardContainerRef.current &&
                !keyboardContainerRef.current.contains(event.target) &&
                !event.target.closest('input')
            ) {
                setShowKeyboard(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (keyboardRef.current) {
            keyboardRef.current.setInput(data.password, 'password');
        }
    }, [data.password]);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleCancel = () => {
        // Redirect to home or another page on cancel
        window.location.href = '/';
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Main Container with Two Sections */}
            <div className="fixed inset-0 flex flex-col md:flex-row bg-white z-60">
                {/* Left Side: Illustration */}
                <div className="relative flex-1 hidden md:block bg-gray-50">

                    {/* Laundry Illustration */}
                    <div className="absolute inset-0 items-center">
                        <img
                            src="storage/loginimage.jpg"
                            alt="Laundry Illustration"
                            className=" w-full h-full "
                        />
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex-1 flex items-center justify-center p-6 md:pr-12">
                    <div className="max-w-sm w-full">
                        {/* Title and Subtitle */}
                        <h2 className="text-2xl font-bold text-black mb-2">
                            Connectez-vous à votre compte !
                        </h2>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-400 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            {/* Hidden Email Field */}
                            <div className="mb-4">
                                <TextInput
                                    id="email"
                                    type="hidden"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="email"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="mb-6">
                                <InputLabel
                                    htmlFor="password"
                                    value="PIN"
                                    className="text-black mb-2"
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full border-2 border-green-500 rounded-lg focus:ring-0 focus:border-green-600"
                                    autoComplete="current-password"
                                    onChange={handlePasswordChange}
                                    onFocus={handlePasswordFocus}
                                    ref={passwordInputRef}
                                    isFocused
                                    aria-label="PIN"
                                />
                                <InputError message={errors.password} className="mt-2 text-red-600" />
                            </div>

                            {/* Virtual Keyboard */}
                                <div ref={keyboardContainerRef} className="mb-6">
                                    <VirtualKeyboard
                                        keyboardRef={keyboardRef}
                                        onChangeAll={onKeyboardChange}
                                        initialLayout={keyboardLayout}
                                        inputName="password"
                                    />
                                </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4 mb-6">
                                <PrimaryButton
                                    disabled={processing}
                                    className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    entrer
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}