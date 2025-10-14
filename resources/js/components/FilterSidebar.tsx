import { Search } from 'lucide-react';
import type { PriceRange } from '../context/FilterContext';

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
                    className="w-full rounded-lg border bg-white py-2 pr-4 pl-10 focus:ring-2 focus:ring-black focus:outline-none text-black"
                />
                <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
            </div>
            <div>
                <h3 className="mb-3 font-semibold text-black">Categories</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category);
                                setCurrentPage(1);
                            }}
                            className={`block w-full rounded-md px-3 py-2 text-left transition-colors ${
                                selectedCategory === category ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="mb-3 font-semibold text-black">Price Range</h3>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min !== undefined ? String(priceRange.min) : ''}
                        onChange={(e) => {
                            setPriceRange({
                                ...priceRange,
                                min: e.target.value === '' ? 0 : parseFloat(e.target.value),
                            });
                            setCurrentPage(1);
                        }}
                        className="w-full rounded-md border border-black bg-white px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-black"
                    />

                    <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max === Infinity || priceRange.max === undefined ? '' : String(priceRange.max)}
                        onChange={(e) => {
                            setPriceRange({
                                ...priceRange,
                                max: e.target.value === '' ? Infinity : parseFloat(e.target.value),
                            });
                            setCurrentPage(1);
                        }}
                        className="w-full rounded-md border border-black bg-white px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-black"
                    />
                </div>
            </div>
            <div>
                <h3 className="mb-3 font-semibold text-black">Sort By</h3>
                <select
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full rounded-md border border-black bg-white px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-black"
                >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                </select>
            </div>
            <button
                onClick={clearFilters}
                className="w-full rounded-md px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-black"
                aria-label="Clear all filters"
            >
                Clear All Filters
            </button>
        </div>
    );
};
