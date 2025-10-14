import { useState } from 'react';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useCart } from 'react-use-cart';
import Hero from '../components/Hero';

export default function Checkout() {
    const { items, cartTotal } = useCart();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        apartment: '',
        city: '',
        country: '',
        postalCode: '',
        saveInfo: false,
    });

    const shipping = 10; // Fixed shipping cost
    const grandTotal = cartTotal + shipping;

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle checkout logic here
        console.log('Checkout data:', formData);
    };

    if (items.length === 0) {
        return (
            <div>
                <div>
                    <div>
                        <Hero
                            title={'Checkout'}
                            description={'Check out your cart'}
                            image={
                                'https://img.freepik.com/free-vector/self-checkout-concept-illustration_114360-2138.jpg?t=st=1738203576~exp=1738207176~hmac=1904ed8c92f08b1427140c971d16311dde8a7d33900e65e78058550a71ab2e14&w=1800'
                            }
                        />
                    </div>
                    <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                        <h2 className="mb-4 text-2xl font-bold">Your cart is empty</h2>
                        <button onClick={() => router.visit('/products')} className="inline-flex items-center gap-2 text-black hover:underline">
                            <ArrowLeft className="h-4 w-4" />
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div>
                <div>
                    <Hero
                        title={'Checkout'}
                        description={'Check out your cart'}
                        image={
                            'https://img.freepik.com/free-vector/self-checkout-concept-illustration_114360-2138.jpg?t=st=1738203576~exp=1738207176~hmac=1904ed8c92f08b1427140c971d16311dde8a7d33900e65e78058550a71ab2e14&w=1800'
                        }
                    />
                </div>
                <div className="mx-auto max-w-7xl px-4 py-16">{/* Checkout Form */}</div>
            </div>
            <Footer />
        </div>
    );
}
