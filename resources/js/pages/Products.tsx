import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Product } from '@/types/types';
import { ChevronLeft, ChevronRight, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FilterModal } from '../components/FilterModal';
import { FilterSidebar } from '../components/FilterSidebar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useFilter } from '../context/FilterContext';

export default function Products() {
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);
    const {
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        searchQuery,
        setSearchQuery,
        priceRange,
        setPriceRange,
        currentPage,
        setCurrentPage,
        categories,
        paginatedProducts,
        totalPages,
        clearFilters,
        viewMode,
        setViewMode,
    } = useFilter();

    // Close modal when screen width changes to desktop
    useEffect(() => {
        const handleResize = (): void => {
            if (window.innerWidth >= 768) {
                setIsFilterMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePreviousPage = (): void => {
        setCurrentPage(Math.max(currentPage - 1, 1));
    };

    const handleNextPage = (): void => {
        setCurrentPage(Math.min(currentPage + 1, totalPages));
    };

    const handlePageClick = (page: number): void => {
        setCurrentPage(page);
    };

    const handleViewModeChange = (mode: 'grid' | 'list'): void => {
        setViewMode(mode);
    };

    const handleOpenFilterMenu = (): void => {
        setIsFilterMenuOpen(true);
    };

    return (
        <div>
            <Navbar />
            <div>
                <Hero
                    title="Our Products"
                    description="Check out our latest collection of fashion products."
                    image="https://img.freepik.com/free-photo/arrangement-different-traveling-elements_23-2148884922.jpg?t=st=1738137007~exp=1738140607~hmac=b4a9afa17b0eb4c59bf04222b0190ca142248d140a30d8a2ee4d5b6922b8e34a&w=996"
                />

                <div className="mx-auto max-w-7xl px-4 py-16">
                    {/* Header and Search */}
                    <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
                        <h1 className="mb-4 text-3xl font-bold text-[#423F3B] md:mb-0">Our Products</h1>
                        <div className="flex w-full gap-4 md:w-auto">
                            <button
                                onClick={() => handleViewModeChange('grid')}
                                className="hidden h-10 w-10 items-center justify-center rounded-md border text-[#423F3B] transition-colors duration-300 ease-in-out hover:bg-gray-100 hover:text-[#423F3B] md:flex"
                                aria-label="Grid view"
                                type="button"
                            >
                                <Grid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => handleViewModeChange('list')}
                                className="hidden h-10 w-10 items-center justify-center rounded-md border text-[#423F3B] transition-colors duration-300 ease-in-out hover:bg-gray-100 hover:text-[#423F3B] md:flex"
                                aria-label="List view"
                                type="button"
                            >
                                <List className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleOpenFilterMenu}
                                className="rounded-lg bg-[#423F3B] p-2 text-white md:hidden"
                                aria-label="Open filters"
                                type="button"
                            >
                                <SlidersHorizontal className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 md:flex-row">
                        {/* Filters Sidebar - Desktop */}
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

                        {/* Filters Modal - Mobile */}
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

                        {/* Products Grid and Pagination */}
                        <div className="flex-1">
                            {paginatedProducts.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-xl text-gray-600">No products found matching your criteria.</p>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 text-[#423F3B] hover:underline"
                                        aria-label="Clear all filters"
                                        type="button"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div
                                        className={viewMode === 'grid' ? 'grid grid-cols-1 gap-8 md:grid-cols-3' : 'flex flex-col gap-8 md:flex-col'}
                                    >
                                        {paginatedProducts.map((product: Product) => (
                                            <ProductCard key={product.id} product={product} viewMode={viewMode} />
                                        ))}
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="mt-12 flex items-center justify-center gap-4">
                                            <button
                                                onClick={handlePreviousPage}
                                                disabled={currentPage === 1}
                                                className="rounded-full p-2 text-[#423F3B] hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                aria-label="Previous page"
                                                type="button"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>

                                            <div className="flex gap-2">
                                                {Array.from({ length: totalPages }, (_, index) => {
                                                    const pageNumber = index + 1;
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => handlePageClick(pageNumber)}
                                                            className={`h-8 w-8 rounded-full ${currentPage === pageNumber ? 'bg-[#423F3B] text-white' : 'text-[#423F3B] hover:bg-gray-100'
                                                                }`}
                                                            aria-label={`Go to page ${pageNumber}`}
                                                            type="button"
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <button
                                                onClick={handleNextPage}
                                                disabled={currentPage === totalPages}
                                                className="rounded-full p-2 text-[#423F3B] hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                aria-label="Next page"
                                                type="button"
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
        </div>
    );
}
