export interface Product {
  id: number;
  name: string;
  price: number;
  cover_image: string;
}
export interface ProductsGridProps {
  products: Product[];
  isLoading: boolean;
  isPaginationLoading: boolean;
}
export interface FilterModalProps {
  priceFrom: string;
  priceTo: string;
  setPriceFrom: (value: string) => void;
  setPriceTo: (value: string) => void;
  fromFocused: boolean;
  toFocused: boolean;
  setFromFocused: (value: boolean) => void;
  setToFocused: (value: boolean) => void;
  preventNegativeInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleApplyFilter: () => void;
  handleRemoveFilters: () => void;
  hasActiveFilters: boolean;
  handleModalClick: (e: React.MouseEvent) => void;
}
