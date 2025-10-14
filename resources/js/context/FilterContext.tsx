import { createContext, useContext, useMemo, useState } from 'react';

import { Product } from '@/types/types';
import { products } from '../data/products';

// Define PriceRange interface
export interface PriceRange {
    min: number;
    max: number;
}

// Define the context value type
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

// Create context with undefined as default (will be provided by provider)
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Define props interface for FilterProvider
interface FilterProviderProps {
    children: React.ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('featured');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 0 });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const productsPerPage: number = 6;

    // Type the products array and memoize categories
    const categories = useMemo((): string[] => {
        return ['All', ...new Set(products.map((p: Product) => p.category))];
    }, []);

    const filteredAndSortedProducts = useMemo((): Product[] => {
        let result: Product[] = [...products];

        // Category filter
        if (selectedCategory !== 'All') {
            result = result.filter((p: Product) => p.category === selectedCategory);
        }

        // Search filter
        if (searchQuery) {
            const query: string = searchQuery.toLowerCase();
            result = result.filter((p: Product) => p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query));
        }

        // Price range filter
        if (priceRange.min !== 0) {
            result = result.filter((p: Product) => p.price >= priceRange.min);
        }
        if (priceRange.max !== 0) {
            result = result.filter((p: Product) => p.price <= priceRange.max);
        }

        // Sorting
        switch (sortBy) {
            case 'price-asc':
                result.sort((a: Product, b: Product) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a: Product, b: Product) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a: Product, b: Product) => b.name.localeCompare(a.name));
                break;
            default:
                // Keep original order for 'featured' or any other case
                break;
        }

        return result;
    }, [selectedCategory, sortBy, searchQuery, priceRange]);

    // Pagination calculations
    const totalPages: number = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
    const paginatedProducts: Product[] = useMemo(() => {
        const startIndex: number = (currentPage - 1) * productsPerPage;
        const endIndex: number = currentPage * productsPerPage;
        return filteredAndSortedProducts.slice(startIndex, endIndex);
    }, [filteredAndSortedProducts, currentPage, productsPerPage]);

    const clearFilters = (): void => {
        setSelectedCategory('All');
        setSortBy('featured');
        setSearchQuery('');
        setPriceRange({ min: 0, max: 0 });
        setCurrentPage(1);
    };

    // Create the context value object
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

    return <FilterContext.Provider value={contextValue}>{children}</FilterContext.Provider>;
}

// Custom hook with proper type checking
export const useFilter = (): FilterContextType => {
    const context = useContext(FilterContext);

    if (context === undefined) {
        throw new Error('useFilter must be used within a FilterProvider');
    }

    return context;
};
