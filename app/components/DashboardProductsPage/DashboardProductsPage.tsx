"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "../Spinner/Spinner";
import { DashboardProductsLoading } from "../DashboardProductsLoading/DashboardProductsLoading";
import { DashboardProductsHeader } from "../DashboardProductsHeader/DashboardProductsHeader";
import { DashboardProductsGrid } from "../DashboardProductsGrid/DashboardProductsGrid";
import { DashboardProductsPagination } from "../DashboardProductsPagination/DashboardProductsPagination";

interface Product {
  id: number;
  name: string;
  price: number;
  cover_image: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PER_PAGE = 10;

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export default function DashboardProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [appliedPriceFrom, setAppliedPriceFrom] = useState("");
  const [appliedPriceTo, setAppliedPriceTo] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthChecked(true);
    };
    checkAuth();
  }, [router]);

  const saveStateToURL = useCallback(
    (page: number, priceFrom: string, priceTo: string, sort: string) => {
      const params = new URLSearchParams();
      if (page > 1) params.set("page", page.toString());
      if (priceFrom.trim()) params.set("price_from", priceFrom);
      if (priceTo.trim()) params.set("price_to", priceTo);
      if (sort.trim()) params.set("sort", sort);

      const newUrl = `${window.location.pathname}${
        params.toString() ? "?" + params.toString() : ""
      }`;
      window.history.replaceState({}, "", newUrl);
    },
    []
  );

  const loadStateFromURL = useCallback(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page") || "1", 10);
    const priceFromParam = params.get("price_from") || "";
    const priceToParam = params.get("price_to") || "";
    const sortParam = params.get("sort") || "";

    setCurrentPage(page);
    setAppliedPriceFrom(priceFromParam);
    setAppliedPriceTo(priceToParam);
    setSortBy(sortParam);
    setIsInitialized(true);
  }, []);

  const fetchProducts = useCallback(
    async (
      page: number,
      minPrice?: string,
      maxPrice?: string,
      sort?: string
    ) => {
      try {
        if (isInitialized) {
          setIsPaginationLoading(true);
          setIsSorting(sort !== sortBy);
        }

        const token = getCookie("token");

        let url = `${API_URL}/products?page=${page}&per_page=${PER_PAGE}`;
        if (minPrice && minPrice.trim() !== "")
          url += `&filter[price_from]=${encodeURIComponent(minPrice)}`;
        if (maxPrice && maxPrice.trim() !== "")
          url += `&filter[price_to]=${encodeURIComponent(maxPrice)}`;
        if (sort && sort.trim() !== "")
          url += `&sort=${encodeURIComponent(sort)}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (res.status === 401) {
          router.push("/sign-in");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        setProducts(data.data || []);
        setTotalPages(data.meta?.last_page || 1);
        setTotalProducts(data.meta?.total || 0);

        if (isInitialized) {
          saveStateToURL(page, minPrice || "", maxPrice || "", sort || "");
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setIsLoading(false);
        setIsPaginationLoading(false);
        setIsSorting(false);
      }
    },
    [isInitialized, saveStateToURL, router, sortBy]
  );

  useEffect(() => {
    if (isAuthChecked) {
      loadStateFromURL();
    }
  }, [loadStateFromURL, isAuthChecked]);

  useEffect(() => {
    if (isInitialized && isAuthChecked) {
      fetchProducts(currentPage, appliedPriceFrom, appliedPriceTo, sortBy);
    }
  }, [
    currentPage,
    appliedPriceFrom,
    appliedPriceTo,
    sortBy,
    fetchProducts,
    isInitialized,
    isAuthChecked,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterApply = (priceFrom: string, priceTo: string) => {
    setAppliedPriceFrom(priceFrom);
    setAppliedPriceTo(priceTo);
    setCurrentPage(1);
  };

  const handleFilterRemove = () => {
    setAppliedPriceFrom("");
    setAppliedPriceTo("");
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  if (!isAuthChecked) {
    return (
      <div className="w-[1720px]  mx-auto mt-[52px] flex justify-center items-center h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (isLoading || !isInitialized) {
    return <DashboardProductsLoading />;
  }

  return (
    <div className="w-[1920px] px-[100px] mx-auto mt-[52px] pb-[224px]">
      <DashboardProductsHeader
        totalProducts={totalProducts}
        currentPage={currentPage}
        perPage={PER_PAGE}
        appliedPriceFrom={appliedPriceFrom}
        appliedPriceTo={appliedPriceTo}
        sortBy={sortBy}
        isSorting={isSorting}
        onFilterApply={handleFilterApply}
        onFilterRemove={handleFilterRemove}
        onSortChange={handleSortChange}
      />

      <DashboardProductsGrid
        products={products}
        isPaginationLoading={isPaginationLoading}
      />

      <DashboardProductsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isPaginationLoading={isPaginationLoading}
      />
    </div>
  );
}
