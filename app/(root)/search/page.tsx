import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { FetchUsersReturnType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async (): Promise<React.JSX.Element | null> => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) return redirect('/onboarding');

    const result: FetchUsersReturnType = await fetchUsers({ userId: user.id });

    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>
            <div className="flex flex-col gap-9 mt-14">
                {result.users.length === 0 ? (
                    <p className="no-result">No users found</p>
                ) : (
                    <>
                        {result.users.map(person => (
                            <UserCard key={person.id} id={person.id} name={person.name} username={person.username} image={person.image} />
                        ))}
                    </>
                )}
            </div>
        </section>
    );
};

export default Page;
