import React from "react";
import Link from "next/link";

export const ProductPageBreadcrumb: React.FC = () => (
  <nav className="text-[#10151F] font-light text-[14px] leading-[100%] tracking-[0%]">
    <Link href="/dashboard" className="hover:underline cursor-pointer">
      Listing
    </Link>{" "}
    / <span className="hover:underline cursor-pointer">Product</span>
  </nav>
);
