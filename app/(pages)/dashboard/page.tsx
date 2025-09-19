"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import filterIcon from "../../../public/images/filter-icon.svg";
import arrowDown from "../../../public/images/arrow-down.svg";

interface Product {
  id: number;
  name: string;
  price: number;
  cover_image: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PER_PAGE = 10;

// Skeleton loader component for individual product
const ProductSkeleton = () => (
  <div className="w-[412px] h-auto animate-pulse">
    <div className="w-full h-[549px] bg-gray-200 rounded-[10px]"></div>
    <div className="mt-[12px] h-[18px] bg-gray-200 rounded w-3/4"></div>
    <div className="mt-[12px] h-[18px] bg-gray-200 rounded w-1/2"></div>
  </div>
);

// Loading spinner component
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4000]"></div>
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);

  async function fetchProducts(page: number) {
    try {
      // Show pagination loading for page changes (not initial load)
      if (products.length > 0) {
        setIsPaginationLoading(true);
      }
      
      const res = await fetch(`${API_URL}/products?page=${page}`);
      const data = await res.json();
      setProducts(data.data || []);
      setTotalPages(data.meta.last_page);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
      setIsPaginationLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 4) {
      // Show all pages if total pages are 4 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Case 1: Current page is 1 - show 1, 2, ..., last-1, last
      if (currentPage === 1) {
        pages.push(1, 2, "...", totalPages - 1, totalPages);
      }
      // Case 2: Current page is 2 - show 1, 2, 3, ..., last
      else if (currentPage === 2) {
        pages.push(1, 2, 3, "...", totalPages);
      }
      // Case 3: Current page is last - show 1, ..., last-1, last
      else if (currentPage === totalPages) {
        pages.push(1, "...", totalPages - 1, totalPages);
      }
      // Case 4: Current page is second to last - show 1, ..., last-2, last-1, last
      else if (currentPage === totalPages - 1) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      }
      // Case 5: Current page is in the middle - show 1, ..., current, current+1, ..., last
      else {
        pages.push(1, "...", currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  // Show skeleton loader for initial loading
  if (isLoading) {
    return (
      <div className="max-w-[1720px] w-full mx-auto mt-[52px]">
        <div className="flex items-center justify-between mb-8">
          <div className="h-[42px] w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-[32px] items-center">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="bg-[#E1DFE1] h-[14px] w-[1px]"></div>
            <div className="flex items-center gap-[8px]">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-4 grid-rows-3 gap-[24px] mt-[32px]">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1720px] w-full mx-auto mt-[52px]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[#10151F] font-semibold text-[42px]">Products</h1>
        <div className="flex gap-[32px] items-center">
          <p className="text-[#3E424A] text-[12px]">
            Showing {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, PER_PAGE * totalPages)} of {PER_PAGE * totalPages} results
          </p>
          <div className="bg-[#E1DFE1] h-[14px] w-[1px]"></div>
          <div className="flex items-center gap-[8px]">
            <Image src={filterIcon} alt="filterIcon" width={24} height={24} />
            <p className="text-[#10151F] text-[16px]">Filter</p>
          </div>
          <div className="ml-[10px] flex items-center gap-[4px] cursor-pointer">
            <p>Sort by</p>
            <Image src={arrowDown} alt="arrowDown" width={20} height={20} />
          </div>
        </div>
      </div>

      {/* Products Grid with Loading State */}
      <div className="relative">
        {isPaginationLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-[10px]">
            <Spinner />
          </div>
        )}
        
        <div className={`grid grid-cols-4 gap-[24px] mt-[32px] ${isPaginationLoading ? 'opacity-50' : ''}`}>
          {products.map((product) => (
            <div key={product.id} className="w-[412px] h-auto cursor-pointer">
              <Image
                src={product.cover_image}
                alt={product.name}
                width={412}
                height={549}
                className="w-full h-[549px] object-cover rounded-[10px]"
              />
              <h2 className="mt-[12px] text-[#10151F] text-[18px] leading-[100%] tracking-[0%]">
                {product.name}
              </h2>
              <h2 className="mt-[12px] text-[#10151F] text-[18px] leading-[100%] tracking-[0%]">
                ${product.price}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-[64px] flex justify-center">
        <div className="flex gap-[8px] cursor-pointer items-center">
          <Image
            src={arrowDown}
            alt="prev"
            width={20}
            height={20}
            className={`transform rotate-90 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
            onClick={handlePrev}
          />
          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <div
                key={idx}
                className="w-[32px] h-[32px] rounded-[4px] border-[1px] border-[#F8F6F7] flex items-center justify-center"
              >
                <p className="text-[14px] leading-[20px] text-[#212B36] opacity-60">...</p>
              </div>
            ) : (
              <div
                key={idx}
                className={`w-[32px] h-[32px] rounded-[4px] border-[2px] flex items-center justify-center cursor-pointer transition-colors ${
                  currentPage === page
                    ? "border-[#FF4000]"
                    : "border-[#F8F6F7] hover:border-[#FF4000] hover:border-opacity-50"
                } ${isPaginationLoading ? 'pointer-events-none opacity-50' : ''}`}
                onClick={() => handlePageClick(page)}
              >
                <p
                  className={`text-[14px] leading-[20px] ${
                    currentPage === page ? "text-[#FF4000]" : "text-[#212B36] opacity-60"
                  }`}
                >
                  {page}
                </p>
              </div>
            )
          )}
          <Image
            src={arrowDown}
            alt="next"
            width={20}
            height={20}
            className={`transform -rotate-90 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
}