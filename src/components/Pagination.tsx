import React from "react";
import { Button } from "rizzui";

interface PaginationProps {
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    onPageChange,
}) => {
    const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    return (
        <div className="rounded-md shadow-md">
            <div className="flex overflow-x-auto whitespace-nowrap gap-2 px-1 scrollbar-hidden">
                {pages.map((page) => (
                    <Button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`min-w-11 text-white px-2 py-1.5 rounded-md text-sm border-0 transition ${currentPage === page
                            ? "bg-green-500 font-semibold"
                            : " hover:bg-neutral-900 bg-neutral-800"
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