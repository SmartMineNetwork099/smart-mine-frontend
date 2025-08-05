import React from "react";
import { Button } from "rizzui";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const generatePages = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="rounded-md shadow-md">
            <div className="flex overflow-x-auto whitespace-nowrap gap-2 px-1 scrollbar-hidden">
                {generatePages().map((page) => (
                    <Button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`min-w-11 px-2 py-1.5 rounded-md text-sm border-0 transition ${currentPage === page
                            ? "bg-green-500 text-white font-semibold"
                            : "text-black hover:bg-gray-100 bg-zinc-100"
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
