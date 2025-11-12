import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '@/types';
import { router } from '@inertiajs/react';

function ProductsContent({ products }: { products: PaginatedProducts }) {
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
        router.visit(`/products?page=${page}`);
    };

    return (
        <>
            <Navbar />
            <div>
                <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                    <img src="/inspire-8.jpg" alt="Products banner" className="absolute w-full h-full object-cover" style={{ filter: 'brightness(0.6)' }} />
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16 text-white">
                            <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wide">OUR PRODUCTS</h1>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-16">
                    {/* Header */}
                    <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
                        <h1 className="mb-4 text-3xl font-bold text-black md:mb-0">Our Products</h1>
                        <div className="flex w-full gap-4 md:w-auto">
                            <button
                                onClick={() => handleViewModeChange('grid')}
                                className="hidden h-10 w-10 items-center justify-center rounded-md border text-black hover:bg-gray-100 md:flex"
                                aria-label="Grid view"
                                type="button"
                            >
                                <Grid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => handleViewModeChange('list')}
                                className="hidden h-10 w-10 items-center justify-center rounded-md border text-black hover:bg-gray-100 md:flex"
                                aria-label="List view"
                                type="button"
                            >
                                <List className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setIsFilterMenuOpen(true)}
                                className="rounded-lg bg-black p-2 text-white md:hidden"
                                aria-label="Open filters"
                                type="button"
                            >
                                <SlidersHorizontal className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 md:flex-row">
                        {/* Sidebar (Desktop) */}
                        <div className="hidden md:block">
                            <FilterSidebar
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                categories={categories}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                clearFilters={clearFilters}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>

                        {/* Modal (Mobile) */}
                        {isFilterMenuOpen && (
                            <FilterModal
                                isFilterMenuOpen={isFilterMenuOpen}
                                setIsFilterMenuOpen={setIsFilterMenuOpen}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                categories={categories}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                clearFilters={clearFilters}
                                setCurrentPage={setCurrentPage}
                            />
                        )}

                        {/* Products */}
                        <div className="flex-1">
                            {paginatedProducts.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-xl text-gray-600">
                                        No products found matching your criteria.
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 text-black hover:underline"
                                        aria-label="Clear all filters"
                                        type="button"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div
                                        className={
                                            viewMode === 'grid'
                                                ? 'grid grid-cols-1 gap-8 md:grid-cols-3'
                                                : 'flex flex-col gap-8'
                                        }
                                    >
                                        {paginatedProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} viewMode={viewMode} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="mt-12 flex items-center justify-center gap-4">
                                            <button
                                                onClick={handlePreviousPage}
                                                disabled={currentPage === 1}
                                                className="rounded-full p-2 text-black hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>

                                            <div className="flex gap-2">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageClick(page)}
                                                        className={`h-8 w-8 rounded-full ${currentPage === page
                                                            ? 'bg-black text-white'
                                                            : 'text-black hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={handleNextPage}
                                                disabled={currentPage === totalPages}
                                                className="rounded-full p-2 text-black hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

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

// Wrap the page with FilterProvider
export default function Products({ products }: { products: PaginatedProducts }) {
    return (
        <FilterProvider products={products.data}>
            <ProductsContent />
        </FilterProvider>
    );
}
