import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { FetchUsersReturnType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }): Promise<React.JSX.Element | null> => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) return redirect('/onboarding');

    const result: FetchUsersReturnType = await fetchUsers({
        userId: user.id,
        searchString: searchParams.search,
        pageNumber: searchParams.page ? +searchParams.page : 1,
        pageSize: 1
    });

    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>
            <div className="mt-5">
                <Searchbar searchType="user" />
            </div>
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
            <Pagination pageNumber={searchParams.page ? +searchParams.page : 1} isNext={result.isNext} />
        </section>
    );
};

export default Page;
