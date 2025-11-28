import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useForm, router, usePage } from '@inertiajs/react';
import { ArrowLeft, AlertCircle, Loader } from 'lucide-react';
import { useCart } from 'react-use-cart';
import { formatPrice } from '../utils/helper';
import { SharedData } from '@/types';
import { useState, useEffect } from 'react';
import SavedAddressSelector from '@/components/checkout/SavedAddressSelector';
import { useSavedAddresses, type SavedAddress } from '@/hooks/useSavedAddresses';

interface Province {
    province_id: string;
    province: string;
}

interface City {
    city_id: string;
    city_name: string;
    type: string;
    postal_code: string;
}

interface ShippingResponse {
    error?: string;
    results?: Array<{
        costs: Array<{
            service: string;
            description: string;
            cost: Array<{
                value: number;
                etd: string;
            }>;
        }>;
    }>;
}


export default function Checkout() {
    const { items, cartTotal } = useCart();
    const { auth } = usePage<SharedData>().props;
    const { addresses: initialAddresses } = useSavedAddresses();

    // Local state to track when user logs in so we can refetch addresses
    const [loadedAddresses, setLoadedAddresses] = useState<SavedAddress[]>([]);
    const addresses = loadedAddresses.length > 0 ? loadedAddresses : initialAddresses;

    // Saved address state
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [useNewAddress, setUseNewAddress] = useState(false);

    // Shipping state
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [, setOriginCities] = useState<City[]>([]);
    const [destCities, setDestCities] = useState<City[]>([]);
    const [couriers, setCouriers] = useState<Record<string, string>>({});

    const [destProvince, setDestProvince] = useState('');
    const [destCity, setDestCity] = useState('');
    const [weight, setWeight] = useState('1000');

    const [shippingCosts, setShippingCosts] = useState<Record<string, ShippingResponse> | null>(null);
    const [shippingLoading, setShippingLoading] = useState(false);
    const [shippingError, setShippingError] = useState('');
    const [selectedShippingCost, setSelectedShippingCost] = useState<number | null>(null);
    const [selectedShippingService, setSelectedShippingService] = useState<{ courier: string, service: string } | null>(null);

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ id: number; code: string; discount_type: string; discount_value: number } | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponLoading, setCouponLoading] = useState(false);

    const { data, setData, processing, errors } = useForm({
        full_name: '',
        email: auth.user ? '' : '', // Email only needed for guest users
        password: '',
        create_account: false,
        phone: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
        shipping_cost: 0,
        shipping_courier: '',
        shipping_service: '',
        destination_city_id: 0,
        coupon_id: 0,
        coupon_discount: 0,
    });

    // Fetch provinces on mount
    useEffect(() => {
        fetchProvinces();
        fetchCouriers();
    }, []);

    // Refetch addresses when user logs in
    useEffect(() => {
        if (auth.user) {
            const fetchAddresses = async () => {
                try {
                    const response = await fetch('/api/customer/addresses');
                    if (response.ok) {
                        const data = await response.json();
                        setLoadedAddresses(data);
                    }
                } catch (err) {
                    console.error('Failed to fetch addresses:', err);
                }
            };
            fetchAddresses();
        }
    }, [auth.user?.id]);

    // Fetch cities when destination province changes
    useEffect(() => {
        if (destProvince) {
            fetchCities(destProvince, 'dest');
        }
    }, [destProvince]);

    // Auto-fill user's default address when they log in
    useEffect(() => {
        if (auth.user && addresses && addresses.length > 0 && !selectedAddressId) {
            // Auto-fill user's name if not already filled
            if (!data.full_name && auth.user.name) {
                setData('full_name', auth.user.name);
            }

            // Find the default address or use the first one
            const defaultAddress = addresses.find((addr: SavedAddress) => addr.is_default) || addresses[0];
            if (defaultAddress) {
                handleAddressSelect(defaultAddress);
            }
        }
    }, [auth.user?.id, addresses.length, addresses]);

    const fetchProvinces = async () => {
        try {
            const response = await fetch('/api/shipping/provinces');
            const result = await response.json();

            if (result.success) {
                setProvinces(result.data);
            } else {
                setShippingError(result.message || 'Failed to fetch provinces');
            }
        } catch (err) {
            setShippingError('Error fetching provinces: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const fetchCities = async (provinceId: string, type: 'origin' | 'dest') => {
        try {
            const response = await fetch('/api/shipping/cities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ province_id: provinceId }),
            });
            const result = await response.json();

            if (result.success) {
                if (type === 'origin') {
                    setOriginCities(result.data);
                } else {
                    setDestCities(result.data);
                }
            } else {
                setShippingError(result.message || 'Failed to fetch cities');
            }
        } catch (err) {
            setShippingError('Error fetching cities: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const fetchCouriers = async () => {
        try {
            const response = await fetch('/api/shipping/couriers');
            const result = await response.json();

            if (result.success) {
                setCouriers(result.data);
            } else {
                setShippingError(result.message || 'Failed to fetch couriers');
            }
        } catch (err) {
            setShippingError('Error fetching couriers: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const calculateShipping = async () => {
        if (!destCity || !weight) {
            setShippingError('Please select destination city and weight');
            return;
        }

        setShippingLoading(true);
        setShippingError('');
        setShippingCosts(null);
        setSelectedShippingCost(null);
        setSelectedShippingService(null);

        try {
            // Use Bandung (165) as origin (shop location)
            // Weight should be in grams, RajaOngkir will convert internally
            const response = await fetch('/api/shipping/multiple-costs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    origin_city_id: 165, // Bandung as origin
                    destination_city_id: parseInt(destCity),
                    weight: Math.max(1000, parseInt(weight)), // Minimum 1000 grams
                    couriers: Object.keys(couriers),
                }),
            });
            const result = await response.json();

            if (result.success) {
                setShippingCosts(result.data);
                setData('destination_city_id', parseInt(destCity));
            } else {
                setShippingError(result.message || 'Failed to calculate shipping');
            }
        } catch (err) {
            setShippingError('Error calculating shipping: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setShippingLoading(false);
        }
    };

    const selectShippingOption = (courier: string, service: string, cost: number) => {
        setSelectedShippingCost(cost);
        setSelectedShippingService({ courier, service });
        setData('shipping_cost', cost);
        setData('shipping_courier', courier);
        setData('shipping_service', service);
    };

    const applyCoupon = async () => {
        if (!couponCode) {
            setCouponError('Please enter a coupon code');
            return;
        }

        setCouponLoading(true);
        setCouponError('');

        try {
            const subtotal = cartTotal - (selectedShippingCost || 0);
            const response = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, subtotal }),
            });

            const result = await response.json();

            if (result.success) {
                setAppliedCoupon(result.coupon);
                setDiscountAmount(result.discount);
                setData('coupon_id', result.coupon.id);
                setData('coupon_discount', result.discount);
                setCouponError('');
            } else {
                setCouponError(result.message || 'Invalid coupon code');
                setAppliedCoupon(null);
                setDiscountAmount(0);
                setData('coupon_id', 0);
                setData('coupon_discount', 0);
            }
        } catch (err) {
            setCouponError('Error validating coupon: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setDiscountAmount(0);
        setCouponError('');
        setData('coupon_id', 0);
        setData('coupon_discount', 0);
    };

    const handleAddressSelect = (address: SavedAddress) => {
        setSelectedAddressId(address.id);
        // Auto-fill form with selected address
        setData('full_name', address.recipient_name);
        setData('phone', address.phone);
        setData('address', address.street_address);
        setData('city', address.city);
        setData('country', address.country);
        setData('postal_code', address.postal_code);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build products array
        const products = items.map((item) => ({
            id: parseInt(item.id.includes('-') ? item.id.split('-')[0] : item.id, 10), // Base product ID as integer
            quantity: typeof item.quantity === 'number' ? item.quantity : (typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : 1),
        }));

        const payload = {
            full_name: data.full_name,
            phone: data.phone,
            address: data.address,
            city: data.city,
            country: data.country,
            postal_code: data.postal_code,
            shipping_cost: data.shipping_cost,
            shipping_courier: data.shipping_courier,
            shipping_service: data.shipping_service,
            destination_city_id: data.destination_city_id,
            coupon_id: data.coupon_id && data.coupon_id > 0 ? data.coupon_id : null,
            coupon_discount: data.coupon_discount && data.coupon_discount > 0 ? data.coupon_discount : 0,
            products: products, // Send as array, not JSON string
            email: !auth.user ? data.email : auth.user.email,
        };

        console.log('Auth user object:', auth.user);
        console.log('Submitting payload:', payload);

        router.post('/orders/pay', payload, {
            onStart: () => {
                console.log('Starting order submission...');
            },
            onSuccess: (page) => {
                console.log('Order successful! Server response:', page);
                // Don't empty cart here - wait until payment is completed
            },
            onError: (errors) => {
                console.error('Order submission errors:', errors);
                console.error('Full error object:', JSON.stringify(errors, null, 2));

                // Show user-friendly error message
                let errorMessage = 'An error occurred during checkout.';
                if (errors.checkout) {
                    errorMessage = errors.checkout;
                } else if (errors.message) {
                    errorMessage = errors.message;
                }

                alert(errorMessage);
            },
            onFinish: () => {
                console.log('Order submission finished');
            },
        });
    };

    if (items.length === 0) {
        return (
            <div>
                <Navbar />
                <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                    <img src="/inspire-10.jpg" alt="Checkout banner" className="absolute w-full h-full object-cover object-top" style={{ filter: 'brightness(0.6)' }} />
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16 text-white">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold uppercase tracking-wide">CHECKOUT</h1>
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16 text-center">
                    <h2 className="mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Your cart is empty</h2>
                    <button
                        onClick={() => router.visit('/products')}
                        className="inline-flex items-center gap-2 text-black hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                <img src="/inspire-10.jpg" alt="Checkout banner" className="absolute w-full h-full object-cover object-top" style={{ filter: 'brightness(0.6)' }} />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16 text-white">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold uppercase tracking-wide">CHECKOUT</h1>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16 grid gap-8 md:grid-cols-2">
                {/* Checkout Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Show saved addresses if user is logged in */}
                    {auth.user && addresses.length > 0 && !useNewAddress && (
                        <div>
                            <SavedAddressSelector
                                addresses={addresses}
                                onAddressSelect={handleAddressSelect}
                                currentAddressId={selectedAddressId}
                            />
                            <button
                                type="button"
                                onClick={() => setUseNewAddress(true)}
                                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                + Use a Different Address
                            </button>
                        </div>
                    )}

                    {/* Show option to go back to saved addresses */}
                    {auth.user && addresses.length > 0 && useNewAddress && (
                        <button
                            type="button"
                            onClick={() => {
                                setUseNewAddress(false);
                                setSelectedAddressId(addresses[0]?.id || null);
                            }}
                            className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                        >
                            ← Back to Saved Addresses
                        </button>
                    )}

                    <div className="mb-8">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-6">Shipping Details</h2>

                        {/* Login/Register Options for Guest Users */}
                        {!auth.user && (
                            <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                                <p className="text-sm text-gray-800 mb-3">
                                    Already have an account? Login for faster checkout or continue as guest.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.visit('/login')}
                                        className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors text-sm"
                                    >
                                        Login
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.visit('/register')}
                                        className="flex-1 px-4 py-2 border border-black text-black rounded-md hover:bg-gray-50 transition-colors text-sm"
                                    >
                                        Register
                                    </button>
                                </div>
                                <div className="mt-3 text-center">
                                    <span className="text-xs text-gray-500">or continue as guest below</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="full_name"
                            name="full_name"
                            type="text"
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                            className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                            required
                        />
                        {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
                    </div>

                    {/* Email field for guest users only */}
                    {!auth.user && (
                        <div>
                            <label htmlFor="guest_email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="guest_email"
                                name="guest_email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                    )}

                    <div>
                    </div>



                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone/WhatsApp (with country code)
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="e.g., +62 812-3456-7890"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                            required
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="w-full">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="Street address, apartment, suite, etc."
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                            required
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <input
                                id="city"
                                name="city"
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                                required
                            />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>

                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                Country
                            </label>
                            <input
                                id="country"
                                name="country"
                                type="text"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                                required
                            />
                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                        </div>

                        <div>
                            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                                Postal Code
                            </label>
                            <input
                                id="postal_code"
                                name="postal_code"
                                type="text"
                                value={data.postal_code}
                                onChange={(e) => setData('postal_code', e.target.value)}
                                className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                                required
                            />
                            {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
                        </div>
                    </div>

                    {/* Shipping Calculator Section */}
                    <div className="mt-8 pt-8 border-t">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-4">Shipping Method</h3>

                        {shippingError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-red-700 text-sm">{shippingError}</p>
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Destination Province
                                </label>
                                <select
                                    value={destProvince}
                                    onChange={(e) => {
                                        setDestProvince(e.target.value);
                                        setDestCity('');
                                        setShippingCosts(null);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Province</option>
                                    {provinces.map((p) => (
                                        <option key={p.province_id} value={p.province_id}>
                                            {p.province}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Destination City
                                </label>
                                <select
                                    value={destCity}
                                    onChange={(e) => {
                                        const selectedCityId = e.target.value;
                                        setDestCity(selectedCityId);
                                        setShippingCosts(null);

                                        // Sync the city field and postal code with the selected destination city
                                        const selectedCity = destCities.find(c => c.city_id === selectedCityId);
                                        if (selectedCity) {
                                            setData('city', selectedCity.city_name);
                                            setData('postal_code', selectedCity.postal_code);
                                        }
                                    }}
                                    disabled={!destProvince}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                >
                                    <option value="">Select City</option>
                                    {destCities.map((c) => (
                                        <option key={c.city_id} value={c.city_id}>
                                            {c.city_name} ({c.type})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Weight (grams)
                                </label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => {
                                        setWeight(e.target.value);
                                        setShippingCosts(null);
                                    }}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="1000"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={calculateShipping}
                            disabled={shippingLoading || !destCity}
                            className="w-full bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {shippingLoading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Calculating...
                                </>
                            ) : (
                                'Calculate Shipping Cost'
                            )}
                        </button>

                        {/* Shipping Options */}
                        {shippingCosts && (
                            <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
                                <h4 className="font-semibold text-gray-900">Select Shipping Option:</h4>

                                {Object.entries(shippingCosts).map(([courier, response]) => {
                                    const courierName = couriers[courier] || courier.toUpperCase();
                                    const hasError = response && 'error' in response;

                                    if (hasError) {
                                        return (
                                            <div
                                                key={courier}
                                                className="p-3 bg-gray-100 border border-gray-300 rounded-md"
                                            >
                                                <p className="text-gray-800 font-semibold text-sm">{courierName}</p>
                                                <p className="text-gray-600 text-xs">
                                                    {response && 'error' in response ? response.error : 'Not available for this route'}
                                                </p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={courier} className="border border-gray-200 rounded-md overflow-hidden">
                                            <div className="bg-gray-50 px-3 py-2">
                                                <h5 className="font-semibold text-gray-900 text-sm">{courierName}</h5>
                                            </div>
                                            <div className="p-3 space-y-2">
                                                {response && 'results' in response && response.results?.[0]?.costs?.map(
                                                    (cost: { service: string; description: string; cost: Array<{ value: number; etd: string }> }, idx: number) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() =>
                                                                selectShippingOption(
                                                                    courier,
                                                                    cost.service,
                                                                    cost.cost?.[0]?.value || 0
                                                                )
                                                            }
                                                            className={`w-full p-3 text-left rounded-md border-2 transition-colors ${selectedShippingService?.courier === courier &&
                                                                selectedShippingService?.service === cost.service
                                                                ? 'border-black bg-gray-100'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="text-left">
                                                                    <p className="font-semibold text-gray-900 text-sm">{cost.service}</p>
                                                                    <p className="text-xs text-gray-600">{cost.description}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Estimasi: {cost.cost?.[0]?.etd || '2-3 hari'}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold text-black">
                                                                        Rp {(cost.cost?.[0]?.value || 0).toLocaleString('id-ID')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {selectedShippingService && (
                            <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded-md">
                                <p className="text-gray-800 text-sm">
                                    <span className="font-semibold">Shipping Selected:</span> {couriers[selectedShippingService.courier]} - {selectedShippingService.service}
                                    <br />
                                    <span className="font-semibold">Cost:</span> Rp {selectedShippingCost?.toLocaleString('id-ID')}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Coupon Section */}
                    <div className="mt-8 pt-8 border-t">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-4">Promo Code</h3>

                        {appliedCoupon ? (
                            <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-md">
                                <p className="text-gray-800 text-sm mb-2">
                                    <span className="font-semibold">Applied:</span> {appliedCoupon.code}
                                    <br />
                                    <span className="font-semibold">Discount:</span> {appliedCoupon.discount_type === 'percentage' ? `${Math.round(appliedCoupon.discount_value)}%` : `Rp ${Math.round(appliedCoupon.discount_value).toLocaleString('id-ID')}`}
                                    <br />
                                    <span className="font-semibold">You save:</span> Rp {discountAmount.toLocaleString('id-ID')}
                                </p>
                                <button
                                    type="button"
                                    onClick={removeCoupon}
                                    className="mt-2 px-3 py-1 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                                >
                                    Remove Coupon
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter coupon code"
                                    className="flex-1 px-4 py-2 border-b border-gray-300 focus:ring-0 focus:outline-none"
                                    disabled={couponLoading}
                                />
                                <button
                                    type="button"
                                    onClick={applyCoupon}
                                    disabled={couponLoading || !couponCode}
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 transition-colors text-sm"
                                >
                                    {couponLoading ? 'Applying...' : 'Apply'}
                                </button>
                            </div>
                        )}

                        {couponError && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-700 text-sm">{couponError}</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !selectedShippingCost}
                        className="mt-8 w-full rounded-md bg-black py-3 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title={!selectedShippingCost ? 'Please select a shipping method' : ''}
                    >
                        {processing ? 'Processing...' : 'Place Order'}
                    </button>

                    {/* Debug: Show any errors */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
                            <h4 className="font-semibold text-red-800">Validation Errors:</h4>
                            {Object.entries(errors).map(([key, error]) => (
                                <p key={key} className="text-red-600 text-sm">
                                    {key}: {error}
                                </p>
                            ))}
                        </div>
                    )}
                </form>

                {/* Cart Summary */}
                <div className="rounded-lg border p-6 shadow-sm h-fit">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        {item.sku && (
                                            <p className="text-sm text-gray-500">
                                                SKU: {item.sku}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                        {item.discount && item.discount > 0 && (
                                            <p className="text-xs text-green-600 font-semibold mt-1">
                                                {item.discount_type === 'percentage'
                                                    ? `Save Rp ${Math.round((item.price * (item.quantity || 1)) * (item.discount / (100 - item.discount))).toLocaleString('id-ID')}`
                                                    : `Save Rp ${Math.round(item.discount * (item.quantity || 1)).toLocaleString('id-ID')}`}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {item.discount && item.discount > 0 ? (
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500 line-through">
                                                    {formatPrice(item.discount_type === 'percentage'
                                                        ? (item.price * (item.quantity || 1) / (1 - item.discount / 100))
                                                        : (item.price * (item.quantity || 1) + item.discount * (item.quantity || 1))
                                                    )}
                                                </p>
                                                <p className="font-semibold text-green-600">
                                                    {formatPrice(item.itemTotal || 0)}
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="font-semibold">
                                                {formatPrice(item.itemTotal || 0)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <hr className="my-4" />
                        <div className="space-y-2">
                            {(() => {
                                // Calculate subtotal with product discounts included
                                const subtotalWithDiscounts = items.reduce((sum, item) => sum + (item.itemTotal || 0), 0);
                                return (
                                    <>
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(subtotalWithDiscounts)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span className={selectedShippingCost ? 'font-semibold text-black' : 'text-gray-500'}>
                                                {selectedShippingCost ? formatPrice(selectedShippingCost) : '-'}
                                            </span>
                                        </div>
                                        {appliedCoupon && discountAmount > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-green-600">Coupon ({appliedCoupon.code})</span>
                                                <span className="font-semibold text-green-600">-Rp {discountAmount.toLocaleString('id-ID')}</span>
                                            </div>
                                        )}
                                        <hr className="my-4" />
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span className="text-black">
                                                {formatPrice(subtotalWithDiscounts + (selectedShippingCost || 0) - discountAmount)}
                                            </span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}