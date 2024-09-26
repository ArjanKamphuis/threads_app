"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomBar = (): React.JSX.Element => {
    const pathname = usePathname();
    return (
        <aside className="bottombar">
            <div className="bottombar_container">
                {sidebarLinks.map(link => {
                    const isActive: boolean = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
                    return (
                        <Link href={link.route} key={link.label} className={`${isActive && 'bg-primary-500'} bottombar_link`}>
                            <Image src={link.imgURL} alt={link.label} width={24} height={24} />
                            <p className="text-subtle-medium text-light-1 max-sm:hidden">{link.label.split(/\s+/)[0]}</p>
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}

export default BottomBar;
