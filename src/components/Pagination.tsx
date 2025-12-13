import React from "react";
import { Button } from "rizzui";

interface PaginationProps {
    currentPage: number;
    onPageChange: (page: number) => void;
    pages: number; // 👈 NEW PROP
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    onPageChange,
    pages=15,
}) => {

    // Dynamically generate array:
    const pageArray = Array.from({ length: pages }, (_, i) => i + 1);

    return (
        <div className="rounded-md shadow-md">
            <div className="flex overflow-x-auto whitespace-nowrap gap-1 sm:gap-2 px-1 scrollbar-hidden">
                {pageArray?.map((page) => (
                    <Button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`min-w-7 sm:w-11 text-white px-2 py-0.5 sm:py-1.5 rounded-md text-xs sm:text-sm border-0 transition ${
                            currentPage === page
                                ? "bg-green-500 font-semibold"
                                : "hover:bg-neutral-900 bg-neutral-800"
                        }`}
                    >
                        {page}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default Pagination;