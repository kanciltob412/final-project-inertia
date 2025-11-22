import { useState, useEffect } from 'react';
import { AlertCircle, Loader } from 'lucide-react';

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

export default function ShippingCalculator() {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [originCities, setOriginCities] = useState<City[]>([]);
    const [destCities, setDestCities] = useState<City[]>([]);
    const [couriers, setCouriers] = useState<Record<string, string>>({});

    const [originProvince, setOriginProvince] = useState('');
    const [originCity, setOriginCity] = useState('');
    const [destProvince, setDestProvince] = useState('');
    const [destCity, setDestCity] = useState('');
    const [weight, setWeight] = useState('1000');
    const [selectedCourier, setSelectedCourier] = useState('jne');

    const [shippingCosts, setShippingCosts] = useState<Record<string, ShippingResponse> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch provinces on mount
    useEffect(() => {
        fetchProvinces();
        fetchCouriers();
    }, []);

    // Fetch cities when origin province changes
    useEffect(() => {
        if (originProvince) {
            fetchCities(originProvince, 'origin');
        }
    }, [originProvince]);

    // Fetch cities when destination province changes
    useEffect(() => {
        if (destProvince) {
            fetchCities(destProvince, 'dest');
        }
    }, [destProvince]);

    const fetchProvinces = async () => {
        try {
            const response = await fetch('/api/shipping/provinces');
            const data = await response.json();

            if (data.success) {
                setProvinces(data.data);
            } else {
                setError(data.message || 'Failed to fetch provinces');
            }
        } catch (err) {
            setError('Error fetching provinces: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const fetchCities = async (provinceId: string, type: 'origin' | 'dest') => {
        try {
            const response = await fetch('/api/shipping/cities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ province_id: provinceId }),
            });
            const data = await response.json();

            if (data.success) {
                if (type === 'origin') {
                    setOriginCities(data.data);
                } else {
                    setDestCities(data.data);
                }
            } else {
                setError(data.message || 'Failed to fetch cities');
            }
        } catch (err) {
            setError('Error fetching cities: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const fetchCouriers = async () => {
        try {
            const response = await fetch('/api/shipping/couriers');
            const data = await response.json();

            if (data.success) {
                setCouriers(data.data);
            } else {
                setError(data.message || 'Failed to fetch couriers');
            }
        } catch (err) {
            setError('Error fetching couriers: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const calculateShipping = async () => {
        if (!originCity || !destCity || !weight) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');
        setShippingCosts(null);

        try {
            const response = await fetch('/api/shipping/multiple-costs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    origin_city_id: parseInt(originCity),
                    destination_city_id: parseInt(destCity),
                    weight: parseInt(weight),
                    couriers: Object.keys(couriers),
                }),
            });
            const data = await response.json();

            if (data.success) {
                setShippingCosts(data.data);
            } else {
                setError(data.message || 'Failed to calculate shipping');
            }
        } catch (err) {
            setError('Error calculating shipping: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Cost Calculator</h1>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Origin Location */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Origin</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Province
                                    </label>
                                    <select
                                        value={originProvince}
                                        onChange={(e) => {
                                            setOriginProvince(e.target.value);
                                            setOriginCity('');
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        City
                                    </label>
                                    <select
                                        value={originCity}
                                        onChange={(e) => setOriginCity(e.target.value)}
                                        disabled={!originProvince}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                    >
                                        <option value="">Select City</option>
                                        {originCities.map((c) => (
                                            <option key={c.city_id} value={c.city_id}>
                                                {c.city_name} ({c.type})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Destination Location */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Destination</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Province
                                    </label>
                                    <select
                                        value={destProvince}
                                        onChange={(e) => {
                                            setDestProvince(e.target.value);
                                            setDestCity('');
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        City
                                    </label>
                                    <select
                                        value={destCity}
                                        onChange={(e) => setDestCity(e.target.value)}
                                        disabled={!destProvince}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                    >
                                        <option value="">Select City</option>
                                        {destCities.map((c) => (
                                            <option key={c.city_id} value={c.city_id}>
                                                {c.city_name} ({c.type})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weight & Courier */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Weight (grams)
                            </label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                min="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="1000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Courier
                            </label>
                            <select
                                value={selectedCourier}
                                onChange={(e) => setSelectedCourier(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {Object.entries(couriers).map(([code, name]) => (
                                    <option key={code} value={code}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <button
                        onClick={calculateShipping}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="h-5 w-5 animate-spin" />
                                Calculating...
                            </>
                        ) : (
                            'Calculate Shipping Cost'
                        )}
                    </button>

                    {/* Results */}
                    {shippingCosts && (
                        <div className="mt-8 space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Shipping Options</h2>

                            {Object.entries(shippingCosts).map(([courier, costs]) => {
                                const courierName = couriers[courier] || courier.toUpperCase();
                                const hasError = costs && 'error' in costs;

                                if (hasError) {
                                    return (
                                        <div
                                            key={courier}
                                            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                                        >
                                            <p className="text-yellow-800 font-semibold">{courierName}</p>
                                            <p className="text-yellow-700 text-sm">
                                                {costs && 'error' in costs ? costs.error : 'Unknown error'}
                                            </p>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={courier} className="border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{courierName}</h3>
                                        <div className="space-y-3">
                                            {costs && 'results' in costs && costs.results?.[0]?.costs?.map(
                                                (
                                                    cost: { service: string; description: string; cost: Array<{ value: number; etd: string }> },
                                                    idx: number
                                                ) => (
                                                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                                                        <p className="font-semibold text-gray-900">{cost.service}</p>
                                                        <p className="text-sm text-gray-600 mb-2">{cost.description}</p>
                                                        {cost.cost?.map((item, i) => (
                                                            <div key={i} className="flex justify-between">
                                                                <span className="text-gray-700">
                                                                    Rp {item.value.toLocaleString('id-ID')}
                                                                </span>
                                                                <span className="text-gray-600 text-sm">
                                                                    {item.etd || '2-3 hari'}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
