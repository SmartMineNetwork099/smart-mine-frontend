"use client";
import React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  visiblePages?: number; // Number of pages to show in sliding window
  onPageChange: (page: number) => void;
};

const SlidingPagination = ({
  currentPage,
  totalPages,
  visiblePages = 3,
  onPageChange,
}: Props) => {
  const getPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const half = Math.floor(visiblePages / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = startPage + visiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    // Add start ellipsis if needed
    if (startPage > 1) {
      pages.push("...");
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add end ellipsis if needed
    if (endPage < totalPages) {
      pages.push("...");
      pages.push(totalPages); // always show last page
    }

    return pages;
  };

  return (
    <div className="flex justify-center gap-1 mt-4 flex-wrap">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold transition ${
          currentPage === 1
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-neutral-800 text-white hover:bg-neutral-700"
        }`}
      >
        &lt;
      </button>

      {/* Pages */}
      {getPages().map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2 py-1 text-sm text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(Number(page))}
            className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold transition ${
              currentPage === page
                ? "bg-green-600 text-white shadow-md scale-105"
                : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold transition ${
          currentPage === totalPages
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-neutral-800 text-white hover:bg-neutral-700"
        }`}
      >
        &gt;
      </button>
    </div>
  );
};

export default SlidingPagination;
