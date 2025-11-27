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
    <div className="fixed inset-0 z-50 bg-[#423F3B]/50 md:hidden flex flex-col">
      {/* Overlay */}
      <div
        className="flex-1"
        onClick={() => setIsFilterMenuOpen(false)}
      />

      {/* Modal Content - Bottom Sheet */}
      <div className="w-full max-h-[90vh] overflow-y-auto bg-white p-6 rounded-t-2xl">
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
            className="w-full rounded-md bg-[#423F3B] py-3 text-white hover:bg-gray-800"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
