import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ChevronLeft, ChevronRight, Grid, List, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product, Category } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { FilterSidebar } from '../components/FilterSidebar';
import { FilterModal } from '../components/FilterModal';

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface ProductFilters {
    search: string;
    category: string;
    min_price: string;
    max_price: string;
    sort: string;
}

interface ProductsProps {
    products: PaginatedProducts;
    categories: Category[];
    filters: ProductFilters;
}

export default function Products({ products, categories, filters }: ProductsProps) {
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [localFilters, setLocalFilters] = useState(filters);
    const handlePreviousPage = () => {
        if (products.current_page > 1) {
            router.visit(`/products?page=${products.current_page - 1}`);
        }
    };

    const handleNextPage = () => {
        if (products.current_page < products.last_page) {
            router.visit(`/products?page=${products.current_page + 1}`);
        }
    };

    const handlePageClick = (page: number) => {
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set('page', page.toString());
        router.visit(`/products?${queryParams.toString()}`);
    };

    // Filter functions
    const applyFilters = (newFilters: Partial<ProductFilters>) => {
        const updatedFilters = { ...localFilters, ...newFilters };
        setLocalFilters(updatedFilters);

        const queryParams = new URLSearchParams();
        if (updatedFilters.search) queryParams.set('search', updatedFilters.search);
        if (updatedFilters.category && updatedFilters.category !== 'All') queryParams.set('category', updatedFilters.category);
        if (updatedFilters.min_price) queryParams.set('min_price', updatedFilters.min_price);
        if (updatedFilters.max_price) queryParams.set('max_price', updatedFilters.max_price);
        if (updatedFilters.sort) queryParams.set('sort', updatedFilters.sort);

        const queryString = queryParams.toString();
        router.visit(`/products${queryString ? '?' + queryString : ''}`);
    };

    const handleSearch = (searchTerm: string) => {
        applyFilters({ search: searchTerm });
    };

    const handleCategoryFilter = (category: string) => {
        applyFilters({ category });
    };

    const handleSortChange = (sort: string) => {
        applyFilters({ sort });
    };

    const clearFilters = () => {
        setLocalFilters({ search: '', category: 'All', min_price: '', max_price: '', sort: 'name' });
        router.visit('/products');
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const startPage = Math.max(1, products.current_page - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(products.last_page, startPage + maxVisiblePages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <>
            <Navbar />
            <div>
                <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                    <img
                        src="/inspire-8.jpg"
                        alt="Products banner"
                        className="absolute w-full h-full object-cover object-center"
                        style={{ filter: 'brightness(0.6)' }}
                    />
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16 text-white">
                            <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wide">OUR PRODUCTS</h1>
                        </div>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-7xl px-4 py-16">
                    <div className="flex gap-8">
                        {/* Desktop Sidebar */}
                        <div className="hidden lg:block">
                            <FilterSidebar
                                searchQuery={localFilters.search || ''}
                                setSearchQuery={handleSearch}
                                selectedCategory={localFilters.category || 'All'}
                                setSelectedCategory={handleCategoryFilter}
                                categories={['All', ...categories.map(c => c.name)]}
                                priceRange={{
                                    min: parseInt(localFilters.min_price || '0'),
                                    max: parseInt(localFilters.max_price || '999999')
                                }}
                                setPriceRange={(range) => applyFilters({
                                    min_price: range.min.toString(),
                                    max_price: range.max.toString()
                                })}
                                sortBy={localFilters.sort || 'name'}
                                setSortBy={handleSortChange}
                                clearFilters={clearFilters}
                                setCurrentPage={() => { }}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Mobile Controls */}
                            <div className="lg:hidden flex justify-between items-center mb-6">
                                <button
                                    onClick={() => setIsFilterMenuOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    <SlidersHorizontal className="h-5 w-5" />
                                    Filters
                                </button>

                                {/* View Mode Toggle */}
                                <div className="flex border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-gray-200 text-black' : 'text-gray-600'} hover:bg-gray-50`}
                                    >
                                        <Grid className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-gray-200 text-black' : 'text-gray-600'} hover:bg-gray-50`}
                                    >
                                        <List className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Desktop View Mode Toggle & Results Info */}
                            <div className="hidden lg:flex justify-between items-center mb-6">
                                <div className="text-sm text-gray-600">
                                    Showing {((products.current_page - 1) * products.per_page) + 1} to{' '}
                                    {Math.min(products.current_page * products.per_page, products.total)} of{' '}
                                    {products.total} products
                                </div>

                                {/* View Mode Toggle */}
                                <div className="flex border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-gray-200 text-black' : 'text-gray-600'} hover:bg-gray-50`}
                                    >
                                        <Grid className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-gray-200 text-black' : 'text-gray-600'} hover:bg-gray-50`}
                                    >
                                        <List className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Products Grid */}
                            <div className={`gap-6 mb-8 ${viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr'
                                : 'flex flex-col space-y-4'
                                }`}>
                                {products.data.map((product: Product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col items-center space-y-4 mb-8">
                                {/* Debug Info */}
                                <div className="text-sm text-gray-600">
                                    Page {products.current_page} of {products.last_page} | {products.total} total products
                                </div>

                                {products.last_page > 1 && (
                                    <div className="flex justify-center items-center space-x-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={handlePreviousPage}
                                            disabled={products.current_page === 1}
                                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex space-x-1">
                                            {getPageNumbers().map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageClick(page)}
                                                    className={`px-3 py-2 text-sm font-medium rounded-md ${page === products.current_page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={handleNextPage}
                                            disabled={products.current_page === products.last_page}
                                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Product Info */}
                    <div className="lg:hidden mt-8 text-center text-gray-600">
                        <p>
                            Showing {((products.current_page - 1) * products.per_page) + 1} to{' '}
                            {Math.min(products.current_page * products.per_page, products.total)} of{' '}
                            {products.total} products
                        </p>
                    </div>
                </div>

                {/* Mobile Filter Modal */}
                <FilterModal
                    isFilterMenuOpen={isFilterMenuOpen}
                    setIsFilterMenuOpen={setIsFilterMenuOpen}
                    searchQuery={localFilters.search || ''}
                    setSearchQuery={(query) => handleSearch(query)}
                    selectedCategory={localFilters.category || 'All'}
                    setSelectedCategory={handleCategoryFilter}
                    categories={['All', ...categories.map(c => c.name)]}
                    priceRange={{ min: parseInt(localFilters.min_price || '0'), max: parseInt(localFilters.max_price || '999999') }}
                    setPriceRange={(range) => applyFilters({ min_price: range.min.toString(), max_price: range.max.toString() })}
                    sortBy={localFilters.sort || 'name'}
                    setSortBy={handleSortChange}
                    clearFilters={clearFilters}
                    setCurrentPage={() => { }}
                />
            </div>
            <Footer />
        </>
    );
}