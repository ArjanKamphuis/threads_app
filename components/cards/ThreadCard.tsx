import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteThread from "../forms/DeleteThread";

type ThreadCardProps = {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        id: string;
        name: string;
        image: string;
    };
    community: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: Date;
    comments: {
        author: {
            image: string;
        }
    }[];
    isComment?: boolean;
};

const ThreadCard = ({ id, currentUserId, parentId, content, author, community, createdAt, comments, isComment }: ThreadCardProps): React.JSX.Element => {
    const commentCount: string = `${comments.length} repl${comments.length === 1 ? 'y' : 'ies'}`;
    return (
        <article className={`flex flex-col w-full rounded-xl ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
            <div className="flex items-start justify-between">
                <div className="flex flex-row flex-1 w-full gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profiles/${author.id}`} className="relative w-11 h-11">
                            <Image src={author.image} alt="Profile image" fill className="cursor-pointer rounded-full" />
                        </Link>
                        <div className="thread-card_bar" />
                    </div>
                    <div className="flex flex-col w-full">
                        <Link href={`/profiles/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
                        </Link>
                        <p className="mt-2 text-small-regular text-light-2">{content}</p>
                        <div className="mt-5 flex flex-col gap-3">
                            <div className="flex gap-3.5">
                                <Image src="/assets/heart-gray.svg" alt="Heart" width={24} height={24} className="cursor-pointer object-contain" />
                                <Link href={`/threads/${id}`}>
                                    <Image src="/assets/reply.svg" alt="Reply" width={24} height={24} className="object-contain" />
                                </Link>
                                <Image src="/assets/repost.svg" alt="Repost" width={24} height={24} className="cursor-pointer object-contain" />
                                <Image src="/assets/share.svg" alt="Share" width={24} height={24} className="cursor-pointer object-contain" />
                            </div>
                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className="mt-1 text-subtle-medium text-gray-1">{commentCount}</p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <DeleteThread threadId={id} currentUserId={currentUserId} authorId={author.id} parentId={parentId} isComment={isComment} />
            </div>
            {!isComment && comments.length > 0 && (
                <Link href={`/threads/${id}`} className="flex items-center gap-2 mt-3 ml-1">
                    {comments.slice(0, 2).reverse().map((comment, index) => (
                        <Image
                            key={index}
                            src={comment.author.image}
                            alt={`user_${index}`}
                            width={24} height={24}
                            className={`rounded-full object-cover ${index !== 0 ? '-ml-5' : ''}`}
                        />
                    ))}
                    <p className="ml-2 text-subtle-medium text-gray-1">{commentCount}</p>
                </Link>
            )}
            {!isComment && community && (
                <Link href={`/communities/${community.id}`} className="flex items-center mt-5">
                    <p className="text-subtle-medium text-gray-1">
                        {formatDateString(createdAt)} - {community.name} Community
                    </p>
                    <Image src={community.image} alt={community.name} width={14} height={14} className="ml-1 rounded-full object-cover" />
                </Link>
            )}
        </article>
    );
};

export default ThreadCard;


