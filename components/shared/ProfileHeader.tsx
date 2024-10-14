import Image from "next/image";
import Link from "next/link";

type ProfileHeaderProps = {
    accountId: string;
    authUserId: string;
    name: string;
    username: string;
    image: string;
    bio: string;
    type?: 'User' | 'Community';
};

const ProfileHeader = ({ accountId, authUserId, name, username, image, bio, type }: ProfileHeaderProps): React.JSX.Element => {
    return (
        <div className="flex flex-col justify-start w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-20 h-20">
                        <Image src={image} alt="Profile image" fill className="rounded-full object-cover shadow-2xl" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
                        <p className="text-base-medium text-gray-1">@{username}</p>
                    </div>
                </div>
                {accountId === authUserId && type !== 'Community' && (
                    <Link href="/profiles/edit">
                        <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2">
                            <Image src="/assets/edit.svg" alt="edit" width={16} height={16} />
                            <p className="text-light-2 max-sm:hidden">Edit</p>
                        </div>
                    </Link>
                )}
            </div>
            <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
            <div className="mt-12 h-0.5 w-full bg-dark-3" />
        </div>
    );
};

export default ProfileHeader;
