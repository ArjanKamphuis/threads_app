import { fetchUserThreads } from "@/lib/actions/user.actions";
import { UserType } from "@/lib/types";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

type ThreadsTabProps = {
    currentUserId: string;
    accountId: string;
    accountType?: 'User';
};

const ThreadsTab = async ({ currentUserId, accountId, accountType }: ThreadsTabProps): Promise<React.JSX.Element> =>  {
    const result: UserType = await fetchUserThreads(accountId);
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
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    );
};

export default ThreadsTab;
