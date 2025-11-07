import { createContext, useContext, useMemo, useState } from 'react';
import { Product } from '@/types';

export interface PriceRange {
    min: number;
    max: number;
}

interface FilterContextType {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    priceRange: PriceRange;
    setPriceRange: (range: PriceRange) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    categories: string[];
    filteredAndSortedProducts: Product[];
    paginatedProducts: Product[];
    totalPages: number;
    clearFilters: () => void;
    productsPerPage: number;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
    children: React.ReactNode;
    products: Product[];
}

export function FilterProvider({ children, products }: FilterProviderProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('featured');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 0 });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const productsPerPage = 6;

    // Compute categories from products
    const categories = useMemo(() => {
        return ['All', ...new Set(products.map((v) => v.category.name))];
    }, [products]);

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        if (selectedCategory !== 'All') {
            result = result.filter((v) => v.category.name === selectedCategory);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (v) =>
                    v.name.toLowerCase().includes(query) ||
                    v.description?.toLowerCase().includes(query)
            );
        }

        if (priceRange.min !== 0) {
            result = result.filter((v) => v.price >= priceRange.min);
        }
        if (priceRange.max !== 0) {
            result = result.filter((v) => v.price <= priceRange.max);
        }

        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        return result;
    }, [products, selectedCategory, sortBy, searchQuery, priceRange]);

    const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = currentPage * productsPerPage;
        return filteredAndSortedProducts.slice(startIndex, endIndex);
    }, [filteredAndSortedProducts, currentPage, productsPerPage]);

    const clearFilters = () => {
        setSelectedCategory('All');
        setSortBy('featured');
        setSearchQuery('');
        setPriceRange({ min: 0, max: 0 });
        setCurrentPage(1);
    };

    const contextValue: FilterContextType = {
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
        filteredAndSortedProducts,
        paginatedProducts,
        totalPages,
        clearFilters,
        productsPerPage,
        viewMode,
        setViewMode,
    };

    return (
        <FilterContext.Provider value={contextValue}>
            {children}
        </FilterContext.Provider>
    );
}

export const useFilter = (): FilterContextType => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};
