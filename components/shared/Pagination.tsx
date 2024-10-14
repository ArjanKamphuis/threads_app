"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { updateSearchParams } from "@/lib/utils";

type PaginationProps = {
    pageNumber: number;
    isNext: boolean;
};

const Pagination = ({ pageNumber, isNext }: PaginationProps): React.JSX.Element => {
    const router = useRouter();

    const handlePaginationClick = React.useCallback((type: 'prev' | 'next') => {
        router.push(updateSearchParams('page', type === 'prev' ? `${pageNumber - 1}` : `${pageNumber + 1}`));
    }, [pageNumber, router]);

    return (
        <div className="pagination">
            <Button
                disabled={pageNumber === 1}
                onClick={() => handlePaginationClick('prev')}
                className="!text-small-regular text-light-2"
            >Prev</Button>
            <p className="text-small-semibold text-light-1">{pageNumber}</p>
            <Button
                disabled={!isNext}
                onClick={() => handlePaginationClick('next')}
                className="!text-small-regular text-light-2"
            >Next</Button>
        </div>
    );
};

export default Pagination;
