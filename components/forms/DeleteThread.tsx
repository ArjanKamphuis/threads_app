"use client";

import { deleteThread } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type DeleteThreadProps = {
    threadId: string;
    currentUserId: string;
    authorId: string;
    parentId: string | null;
    isComment?: boolean;
};

const DeleteThread = ({ threadId, currentUserId, authorId, parentId, isComment }: DeleteThreadProps): React.JSX.Element | null => {
    const pathname = usePathname();
    const router = useRouter();

    const handleDeleteClick = React.useCallback(async () => {
        await deleteThread(`${threadId}`, pathname);
        if (!parentId || !isComment) router.push('/');
    }, [isComment, parentId, pathname, router, threadId]);

    if (currentUserId !== authorId || pathname === '/') return null;

    return (
        <Image
            src="/assets/delete.svg"
            alt="delete"
            width={18} height={18}
            className="cursor-pointer object-contain"
            onClick={handleDeleteClick}
        />
    );
};

export default DeleteThread;
