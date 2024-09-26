import { fetchActivity, fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async (): Promise<React.JSX.Element | null> => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) return redirect('/onboarding');

    const activity = await fetchActivity(userInfo._id);

    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>
            <section className="flkkex flex-col gap-5 mt-10">
                {activity.length === 0 ? (
                    <p className="!text-base-regular text-light-3">No activity yet</p>
                ) : (
                    <>
                        {activity.map(activity => (
                            <Link key={activity._id} href={`/threads/${activity.parentId}`}>
                                <article className="activity-card">
                                    <Image src={activity.author.image} alt="Profile picture" width={20} height={20} className="rounded-full object-cover" />
                                    <p className="!text-small-regular text-light-1">
                                        <span className="mr-2 text-primary-500">{activity.author.name}</span>
                                        replied to your thread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                )}
            </section>
        </section>
    );
};

export default Page;
