import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async (): Promise<React.JSX.Element | null> => {
    const user = await currentUser();
    if (!user) redirect('/sign-in');

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    const userData = {
        id: user.id,
        username: userInfo.username,
        name: userInfo.name,
        bio: userInfo.bio,
        image: userInfo.image
    };

    return (
        <>
            <h1 className="head-text">Edit Profile</h1>
            <p className="mt-3 text-base-regular text-light-2">Change your profile</p>
            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile user={userData} btnTitle="Save" />
            </section>
        </>
    );
};

export default Page;
