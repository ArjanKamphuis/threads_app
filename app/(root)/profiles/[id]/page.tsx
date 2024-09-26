import { ProfileHeader, ThreadsTab } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string }}): Promise<React.JSX.Element | null> => {
    if (!params.id) return null;
    
    const user = await currentUser();
    if (!user) return null;

    const profileUser = await fetchUser(params.id);
    if (!profileUser) return redirect('/');

    return (
        <section>
            <ProfileHeader account={profileUser} authUserId={user.id} />
            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {profileTabs.map(tab => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image src={tab.icon} alt={tab.label} width={24} height={24} className="object-contain w-auto" />
                                <p className="max-sm:hidden">{tab.label}</p>
                                {tab.label === 'Threads' && (
                                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">{profileUser.threads.length}</p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {profileTabs.map(tab => (
                        <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
                            <ThreadsTab
                                currentUserId={user.id}
                                accountId={profileUser.id}
                                accountType="User"
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
};

export default Page;
