import UserCard from "@/components/cards/UserCard";
import { ProfileHeader, ThreadsTab } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import { CommunityType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const Page = async ({ params }: { params: { id: string }}): Promise<React.JSX.Element | null> => {
    const user = await currentUser();
    if (!user) return null;

    const communityDetails: CommunityType = await fetchCommunityDetails(params.id);

    return (
        <section>
            <ProfileHeader
                accountId={communityDetails.id}
                authUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                image={communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
            />
            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {communityTabs.map(tab => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image src={tab.icon} alt={tab.label} width={24} height={24} className="object-contain w-auto" />
                                <p className="max-sm:hidden">{tab.label}</p>
                                {tab.label === 'Threads' && (
                                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">{communityDetails.threads.length}</p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="threads" className="w-full text-light-1">
                        <ThreadsTab
                            currentUserId={user.id}
                            accountId={communityDetails._id}
                            accountType="Community"
                        />
                    </TabsContent>
                    <TabsContent value="members" className="w-full text-light-1">
                        <section className="flex flex-col gap-10 mt-9">
                            {communityDetails.members.map(member => (
                                <UserCard key={member.id} id={member.id} name={member.name} username={member.username} image={member.image} />
                            ))}
                        </section>
                    </TabsContent>
                    <TabsContent value="requests" className="w-full text-light-1">
                        <ThreadsTab
                            currentUserId={user.id}
                            accountId={communityDetails._id}
                            accountType="Community"
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default Page;
