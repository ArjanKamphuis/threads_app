"use client";

import React from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateSearchParams } from "@/lib/utils";

const Searchbar = ({ searchType }: { searchType: 'user' | 'community' }): React.JSX.Element => {
    const [search, setSearch] = React.useState<string>('');
    const router = useRouter();

    React.useEffect(() => {
        const timeoutId: NodeJS.Timeout = setTimeout(() => {
            router.push(updateSearchParams('search', search));
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [router, search]);

    return (
        <div className="searchbar">
            <Image src="/assets/search-gray.svg" alt="Search" width={24} height={24} className="object-contain" />
            <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={searchType === 'user' ? 'Find user...' : 'Find community...'}
                className="no-focus searchbar_input"
            />
        </div>
    );
};

export default Searchbar;
