import { Search } from 'lucide-react';
import type { PriceRange } from '../context/FilterContext';
import { useState, useRef, useEffect } from 'react';

interface FilterSidebarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    categories: string[];
    priceRange: PriceRange;
    setPriceRange: (range: PriceRange) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    clearFilters: () => void;
    setCurrentPage: (page: number) => void;
}

// Komponen FilterSidebar untuk Desktop
export const FilterSidebar = ({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    clearFilters,
    setCurrentPage,
}: FilterSidebarProps) => {
    const [localMinPrice, setLocalMinPrice] = useState('');
    const [localMaxPrice, setLocalMaxPrice] = useState('');
    const minPriceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const maxPriceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Sync local state with priceRange prop when it changes (only if there's an actual filter value)
    useEffect(() => {
        if (priceRange.min && priceRange.min > 0 && localMinPrice === '') {
            setLocalMinPrice(String(priceRange.min));
        }
        if (priceRange.max && priceRange.max !== Infinity && localMaxPrice === '') {
            setLocalMaxPrice(String(priceRange.max));
        }
    }, [priceRange]);

    const handleMinPriceChange = (value: string) => {
        setLocalMinPrice(value);

        if (minPriceTimeoutRef.current) {
            clearTimeout(minPriceTimeoutRef.current);
        }

        minPriceTimeoutRef.current = setTimeout(() => {
            setPriceRange({
                ...priceRange,
                min: value === '' ? 0 : parseFloat(value),
            });
            setCurrentPage(1);
        }, 1500);
    };

    const handleMaxPriceChange = (value: string) => {
        setLocalMaxPrice(value);

        if (maxPriceTimeoutRef.current) {
            clearTimeout(maxPriceTimeoutRef.current);
        }

        maxPriceTimeoutRef.current = setTimeout(() => {
            setPriceRange({
                ...priceRange,
                max: value === '' ? Infinity : parseFloat(value),
            });
            setCurrentPage(1);
        }, 1500);
    };
    return (
        <div className="w-64 space-y-6">
            <div className="relative flex-1 md:w-64">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border bg-white py-2 pr-4 pl-10 focus:ring-2 focus:ring-[#423F3B] focus:outline-none text-[#423F3B]"
                />
                <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
            </div>
            <div>
                <h3 className="mb-3 font-semibold text-[#423F3B]">Categories</h3>
                <select
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full rounded-md border border-[#423F3B] bg-white px-3 py-2 focus:ring-2 focus:ring-[#423F3B] focus:outline-none text-[#423F3B]"
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <h3 className="mb-3 font-semibold text-[#423F3B]">Price Range</h3>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={localMinPrice}
                        onChange={(e) => handleMinPriceChange(e.target.value)}
                        className="w-full rounded-md border border-[#423F3B] bg-white px-3 py-2 focus:ring-2 focus:ring-[#423F3B] focus:outline-none text-[#423F3B] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <input
                        type="number"
                        placeholder="Max"
                        value={localMaxPrice}
                        onChange={(e) => handleMaxPriceChange(e.target.value)}
                        className="w-full rounded-md border border-[#423F3B] bg-white px-3 py-2 focus:ring-2 focus:ring-[#423F3B] focus:outline-none text-[#423F3B] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
            </div>
            <div>
                <h3 className="mb-3 font-semibold text-[#423F3B]">Sort By</h3>
                <select
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full rounded-md border border-[#423F3B] bg-white px-3 py-2 focus:ring-2 focus:ring-[#423F3B] focus:outline-none text-[#423F3B]"
                >
                    <option value="name">Sort by Name</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                </select>
            </div>
            <button
                onClick={clearFilters}
                className="w-full rounded-md px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#423F3B]"
                aria-label="Clear all filters"
            >
                Clear All Filters
            </button>
        </div>
    );
};
