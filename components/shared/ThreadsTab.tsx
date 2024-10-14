import { fetchUserThreads } from "@/lib/actions/user.actions";
import { CommunityType, UserType } from "@/lib/types";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityThreads } from "@/lib/actions/community.actions";

type ThreadsTabProps = {
    currentUserId: string;
    accountId: string;
    accountType?: 'User' | 'Community';
};

const ThreadsTab = async ({ currentUserId, accountId, accountType }: ThreadsTabProps): Promise<React.JSX.Element> =>  {
    const result: UserType | CommunityType | undefined = accountType === 'User'
        ? await fetchUserThreads(accountId)
        : await fetchCommunityThreads(accountId);
    if (!result) redirect('/');
    
    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map(thread => (
                <ThreadCard
                    key={`${thread._id}`}
                    id={`${thread._id}`}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === 'User'
                            ? { name: result.name, image: result.image, id: result.id }
                            : { name: thread.author.name, image: thread.author.image, id: `${thread.author._id}` }
                    }
                    community={
                        accountType === 'User' && thread.community
                        ? { name: thread.community.name, image: thread.community.image, id: thread.community.id }
                        : { name: result.name, image: result.image, id: result.id }
                    }
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    );
};

export default ThreadsTab;
