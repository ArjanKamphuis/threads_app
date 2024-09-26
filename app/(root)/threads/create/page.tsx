import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { UserType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async (): Promise<React.JSX.Element | null> => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo: UserType | undefined = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');
    
    return (
        <>
            <h1 className="head-text">Create Thread</h1>
            <PostThread userId={`${userInfo._id}`} />
        </>
    );
};

export default Page;
