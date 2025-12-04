import SavedAddressSelector from '@/components/checkout/SavedAddressSelector';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useSavedAddresses, type SavedAddress } from '@/hooks/useSavedAddresses';
import { SharedData } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Loader } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import { formatPrice } from '../utils/helper';

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
    const [selectedShippingService, setSelectedShippingService] = useState<{ courier: string; service: string } | null>(null);

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

    const handleAddressSelect = useCallback(
        (address: SavedAddress) => {
            setSelectedAddressId(address.id);
            // Auto-fill form with selected address
            setData('full_name', address.recipient_name);
            setData('phone', address.phone);
            setData('address', address.street_address);
            setData('city', address.city);
            setData('country', address.country);
            setData('postal_code', address.postal_code);
        },
        [setData],
    );

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
    }, [auth.user]);

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
    }, [auth.user, addresses, selectedAddressId, data.full_name, handleAddressSelect, setData]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user is authenticated - guests must register/login to complete order
        if (!auth.user) {
            alert('Please register or login to complete your order.');
            router.visit('/login', { method: 'get' });
            return;
        }

        // Build products array
        const products = items.map((item) => ({
            id: parseInt(item.id.includes('-') ? item.id.split('-')[0] : item.id, 10), // Base product ID as integer
            quantity: typeof item.quantity === 'number' ? item.quantity : typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : 1,
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

        // Use Inertia router.post with onSuccess to handle response
        router.post('/orders/pay', payload, {
            preserveScroll: true,
            onSuccess: (page) => {
                console.log('Order successful! Page props:', page.props);
                // When PaymentRedirect component is rendered, it will redirect
                // But we also handle it here just in case
                const responseData = page.props as unknown as { payment_url?: string };
                // Give the component time to render and redirect
                setTimeout(() => {
                    if (responseData.payment_url && typeof responseData.payment_url === 'string') {
                        console.log('Fallback: Redirecting to payment URL:', responseData.payment_url);
                        window.location.href = responseData.payment_url;
                    }
                }, 100);
            },
            onError: (errors) => {
                console.error('Order submission errors:', errors);
                let errorMessage = 'An error occurred during checkout.';
                if (errors.checkout) {
                    errorMessage = errors.checkout;
                } else if (errors.message) {
                    errorMessage = errors.message;
                } else {
                    const firstError = Object.values(errors)[0];
                    if (Array.isArray(firstError)) {
                        errorMessage = firstError[0];
                    } else {
                        errorMessage = String(firstError);
                    }
                }
                alert(errorMessage);
            },
        });
    };
    if (items.length === 0) {
        return (
            <div>
                <Navbar />
                <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                    <img
                        src="/inspire-10.jpg"
                        alt="Checkout banner"
                        className="absolute h-full w-full object-cover object-top"
                        style={{ filter: 'brightness(0.6)' }}
                    />
                    <div className="absolute inset-0 flex items-center">
                        <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 text-white md:translate-y-16">
                            <h1 className="text-4xl font-semibold tracking-wide uppercase md:text-5xl lg:text-6xl">CHECKOUT</h1>
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-4 py-8 text-center md:px-6 md:py-12 lg:px-8 lg:py-16">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">Your cart is empty</h2>
                    <button onClick={() => router.visit('/products')} className="inline-flex items-center gap-2 text-black hover:underline">
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
            <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                <img
                    src="/inspire-10.jpg"
                    alt="Checkout banner"
                    className="absolute h-full w-full object-cover object-top"
                    style={{ filter: 'brightness(0.6)' }}
                />
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 text-white md:translate-y-16">
                        <h1 className="text-4xl font-semibold tracking-wide uppercase md:text-5xl lg:text-6xl">CHECKOUT</h1>
                    </div>
                </div>
            </div>

            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 md:grid-cols-2 md:px-6 md:py-12 lg:px-8 lg:py-16">
                {/* Checkout Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Alert for guests - must register to complete order */}
                    {!auth.user && (
                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-orange-900">Login Required</p>
                                    <p className="text-sm text-orange-800 mt-1">
                                        You must <a href="/login" className="font-semibold underline hover:text-orange-900">login</a> or <a href="/register" className="font-semibold underline hover:text-orange-900">register</a> to complete your order.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show saved addresses if user is logged in */}
                    {auth.user && addresses.length > 0 && !useNewAddress && (
                        <div>
                            <SavedAddressSelector addresses={addresses} onAddressSelect={handleAddressSelect} currentAddressId={selectedAddressId} />
                            <button
                                type="button"
                                onClick={() => setUseNewAddress(true)}
                                className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
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
                            className="text-sm font-medium text-gray-600 hover:text-gray-700"
                        >
                            ← Back to Saved Addresses
                        </button>
                    )}

                    <div className="mb-8">
                        <h2 className="mb-6 text-xl font-semibold text-gray-900 md:text-2xl lg:text-3xl">Shipping Details</h2>
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
                        {errors.full_name && <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>}
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
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>
                    )}

                    <div></div>

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
                        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
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
                        {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
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
                            {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
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
                            {errors.postal_code && <p className="mt-1 text-sm text-red-500">{errors.postal_code}</p>}
                        </div>
                    </div>

                    {/* Shipping Calculator Section */}
                    <div className="mt-8 border-t pt-8">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl">Shipping Method</h3>

                        {shippingError && (
                            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                <p className="text-sm text-red-700">{shippingError}</p>
                            </div>
                        )}

                        <div className="mb-6 space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Province</label>
                                <select
                                    value={destProvince}
                                    onChange={(e) => {
                                        setDestProvince(e.target.value);
                                        setDestCity('');
                                        setShippingCosts(null);
                                    }}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
                                <label className="mb-2 block text-sm font-medium text-gray-700">City</label>
                                <select
                                    value={destCity}
                                    onChange={(e) => {
                                        const selectedCityId = e.target.value;
                                        setDestCity(selectedCityId);
                                        setShippingCosts(null);

                                        // Sync the city field and postal code with the selected destination city
                                        const selectedCity = destCities.find((c) => c.city_id === selectedCityId);
                                        if (selectedCity) {
                                            setData('city', selectedCity.city_name);
                                            setData('postal_code', selectedCity.postal_code);
                                        }
                                    }}
                                    disabled={!destProvince}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                                <label className="mb-2 block text-sm font-medium text-gray-700">Total Weight (grams)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => {
                                        setWeight(e.target.value);
                                        setShippingCosts(null);
                                    }}
                                    min="1"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                    placeholder="1000"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={calculateShipping}
                            disabled={shippingLoading || !destCity}
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-black py-2 font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
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
                            <div className="mt-6 max-h-96 space-y-4 overflow-y-auto">
                                <h4 className="font-semibold text-gray-900">Select Shipping Option:</h4>

                                {Object.entries(shippingCosts).map(([courier, response]) => {
                                    const courierName = couriers[courier] || courier.toUpperCase();
                                    const hasError = response && 'error' in response;

                                    if (hasError) {
                                        return (
                                            <div key={courier} className="rounded-md border border-gray-300 bg-gray-100 p-3">
                                                <p className="text-sm font-semibold text-gray-800">{courierName}</p>
                                                <p className="text-xs text-gray-600">
                                                    {response && 'error' in response ? response.error : 'Not available for this route'}
                                                </p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={courier} className="overflow-hidden rounded-md border border-gray-200">
                                            <div className="bg-gray-50 px-3 py-2">
                                                <h5 className="text-sm font-semibold text-gray-900">{courierName}</h5>
                                            </div>
                                            <div className="space-y-2 p-3">
                                                {response &&
                                                    'results' in response &&
                                                    response.results?.[0]?.costs?.map(
                                                        (
                                                            cost: {
                                                                service: string;
                                                                description: string;
                                                                cost: Array<{ value: number; etd: string }>;
                                                            },
                                                            idx: number,
                                                        ) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() =>
                                                                    selectShippingOption(courier, cost.service, cost.cost?.[0]?.value || 0)
                                                                }
                                                                className={`w-full rounded-md border-2 p-3 text-left transition-colors ${selectedShippingService?.courier === courier &&
                                                                    selectedShippingService?.service === cost.service
                                                                    ? 'border-black bg-gray-100'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                                    }`}
                                                            >
                                                                <div className="flex items-start justify-between">
                                                                    <div className="text-left">
                                                                        <p className="text-sm font-semibold text-gray-900">{cost.service}</p>
                                                                        <p className="text-xs text-gray-600">{cost.description}</p>
                                                                        <p className="mt-1 text-xs text-gray-500">
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
                                                        ),
                                                    )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {selectedShippingService && (
                            <div className="mt-4 rounded-md border border-gray-300 bg-gray-100 p-3">
                                <p className="text-sm text-gray-800">
                                    <span className="font-semibold">Shipping Selected:</span> {couriers[selectedShippingService.courier]} -{' '}
                                    {selectedShippingService.service}
                                    <br />
                                    <span className="font-semibold">Cost:</span> Rp {selectedShippingCost?.toLocaleString('id-ID')}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Coupon Section */}
                    <div className="mt-8 border-t pt-8">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl">Promo Code</h3>

                        {appliedCoupon ? (
                            <div className="mb-4 rounded-md border border-gray-300 bg-gray-100 p-3">
                                <p className="mb-2 text-sm text-gray-800">
                                    <span className="font-semibold">Applied:</span> {appliedCoupon.code}
                                    <br />
                                    <span className="font-semibold">Discount:</span>{' '}
                                    {appliedCoupon.discount_type === 'percentage'
                                        ? `${Math.round(appliedCoupon.discount_value)}%`
                                        : formatPrice(Math.round(appliedCoupon.discount_value))}
                                    <br />
                                    <span className="font-semibold">You save:</span> {formatPrice(discountAmount)}
                                </p>
                                <button
                                    type="button"
                                    onClick={removeCoupon}
                                    className="mt-2 rounded bg-gray-300 px-3 py-1 text-sm text-gray-800 transition-colors hover:bg-gray-400"
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
                                    className="flex-1 border-b border-gray-300 px-4 py-2 focus:ring-0 focus:outline-none"
                                    disabled={couponLoading}
                                />
                                <button
                                    type="button"
                                    onClick={applyCoupon}
                                    disabled={couponLoading || !couponCode}
                                    className="rounded-md bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400"
                                >
                                    {couponLoading ? 'Applying...' : 'Apply'}
                                </button>
                            </div>
                        )}

                        {couponError && (
                            <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-2">
                                <p className="text-sm text-red-700">{couponError}</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !selectedShippingCost || !auth.user}
                        className="mt-8 w-full rounded-md bg-black py-3 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        title={!auth.user ? 'Please login to complete your order' : !selectedShippingCost ? 'Please select a shipping method' : ''}
                    >
                        {processing ? 'Processing...' : 'Place Order'}
                    </button>

                    {/* Debug: Show any errors */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mt-4 rounded border border-red-300 bg-red-100 p-3">
                            <h4 className="font-semibold text-red-800">Validation Errors:</h4>
                            {Object.entries(errors).map(([key, error]) => (
                                <p key={key} className="text-sm text-red-600">
                                    {key}: {error}
                                </p>
                            ))}
                        </div>
                    )}
                </form>

                {/* Cart Summary */}
                <div className="h-fit rounded-lg border p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl">Order Summary</h2>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        {item.sku && <p className="text-sm text-gray-500">SKU: {item.sku}</p>}
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        {item.discount && item.discount > 0 && (
                                            <p className="mt-1 text-xs font-semibold text-green-600">
                                                {item.discount_type === 'percentage'
                                                    ? `Save Rp ${Math.round(item.price * (item.quantity || 1) * (item.discount / (100 - item.discount))).toLocaleString('id-ID')}`
                                                    : `Save Rp ${Math.round(item.discount * (item.quantity || 1)).toLocaleString('id-ID')}`}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {item.discount && item.discount > 0 ? (
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500 line-through">
                                                    {formatPrice(
                                                        item.discount_type === 'percentage'
                                                            ? (item.price * (item.quantity || 1)) / (1 - item.discount / 100)
                                                            : item.price * (item.quantity || 1) + item.discount * (item.quantity || 1),
                                                    )}
                                                </p>
                                                <p className="font-semibold text-green-600">{formatPrice(item.itemTotal || 0)}</p>
                                            </div>
                                        ) : (
                                            <span className="font-semibold">{formatPrice(item.itemTotal || 0)}</span>
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
                                                <span className="font-semibold text-green-600">-{formatPrice(discountAmount)}</span>
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
