import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import Pagination from "@/components/shared/Pagination";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({
    params, searchParams
}: {
    params: { id: string }, searchParams: { [key: string]: string | undefined }
}): Promise<React.JSX.Element | null> => {
    if (!params.id) return null;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo) return null;
    if (!userInfo.onboarded) return redirect('/onboarding');

    const result = await fetchThreadById({
        id: params.id,
        pageNumber: searchParams.page ? +searchParams.page : 1,
        pageSize: 2
    });
    if (!result.thread) return null;

    return (
        <section className="relative">
            <ThreadCard
                id={`${result.thread._id}`}
                currentUserId={user.id}
                parentId={result.thread.parentId}
                content={result.thread.text}
                author={result.thread.author}
                community={result.thread.community}
                createdAt={result.thread.createdAt}
                comments={result.thread.children}
            />

            <div className="mt-7">
                <Comment threadId={`${result.thread._id}`} currentUserImg={userInfo.image} currentUserId={`${userInfo._id}`} />
            </div>
            <div className="mt-10 flex flex-col gap-5">
                {result.comments.map(comment => (
                    <ThreadCard
                        key={`${comment._id}`}
                        id={`${comment._id}`}
                        currentUserId={`${userInfo._id}`}
                        parentId={comment.parentId}
                        content={comment.text}
                        author={comment.author}
                        community={comment.community}
                        createdAt={comment.createdAt}
                        comments={comment.children}
                        isComment
                    />
                ))}
                <Pagination pageNumber={searchParams.page ? +searchParams.page : 1} isNext={result.isNext} />
            </div>
        </section>
    );
};

export default Page;
