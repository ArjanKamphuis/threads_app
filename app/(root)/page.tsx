import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { FetchThreadsReturnType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Home = async (): Promise<React.JSX.Element | null> => {
    const user = await currentUser();
    if (!user) return null;

    const userData = await fetchUser(user.id);
    if (!userData?.onboarded) return redirect('/onboarding');

    const result: FetchThreadsReturnType = await fetchThreads();

    return (
        <>
            <h1 className="head-text text-left">Home</h1>
            <section className="mt-9 flex flex-col gap-10">
                {result.threads.length === 0 ? (
                    <p className="no-result">No threads found</p>
                ) : (
                    <>
                        {result.threads.map(thread => (
                            <ThreadCard
                                key={`${thread._id}`}
                                id={`${thread._id}`}
                                currentUserId={user.id}
                                parentId={thread.parentId}
                                content={thread.text}
                                author={thread.author}
                                community={thread.community}
                                createdAt={thread.createdAt}
                                comments={thread.children}
                            />
                        ))}
                    </>
                )}
            </section>
        </>
    );
};

export default Home;
