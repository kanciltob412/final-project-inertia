import { X } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";
import type { PriceRange } from "../context/FilterContext";

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

interface FilterModalProps extends FilterSidebarProps {
  isFilterMenuOpen: boolean;
  setIsFilterMenuOpen: (open: boolean) => void;
}

export const FilterModal = ({
  isFilterMenuOpen,
  setIsFilterMenuOpen,
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
}: FilterModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
      <div className="absolute top-0 right-0 h-full w-80 overflow-y-auto bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold">Filters</h3>
          <button
            onClick={() => setIsFilterMenuOpen(false)}
            className="rounded-full p-2 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-6">
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
          <button
            onClick={() => setIsFilterMenuOpen(false)}
            className="w-full rounded-md bg-black py-3 text-black hover:bg-gray-800"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
