import CommunityCard from "@/components/cards/CommunityCard";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { FetchCommunitiesReturnType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }): Promise<React.JSX.Element | null> => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) return redirect('/onboarding');

    const result: FetchCommunitiesReturnType = await fetchCommunities({
        searchString: searchParams.search,
        pageNumber: searchParams.page ? +searchParams.page : 1,
        pageSize: 1
    });

    return (
        <section>
            <h1 className="head-text mb-10">Communities</h1>
            <div className="mt-5">
                <Searchbar searchType="community" />
            </div>
            <div className="flex flex-col gap-9 mt-14">
                {result.communities.length === 0 ? (
                    <p className="no-result">No communities found</p>
                ) : (
                    <>
                        {result.communities.map(community => (
                            <CommunityCard
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                image={community.image}
                                bio={community.bio}
                                members={community.members.map(member => ({ image: member.image }) )}
                            />
                        ))}
                    </>
                )}
            </div>
            <Pagination pageNumber={searchParams.page ? +searchParams.page : 1} isNext={result.isNext} />
        </section>
    );
};

export default Page;
