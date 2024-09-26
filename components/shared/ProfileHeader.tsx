import { UserType } from "@/lib/types";
import Image from "next/image";

type ProfileHeaderProps = {
    account: UserType;
    authUserId: string;
};

const ProfileHeader = ({ account, authUserId }: ProfileHeaderProps): React.JSX.Element => {
    return (
        <div className="flex flex-col justify-start w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-20 h-20">
                        <Image src={account.image} alt="Profile image" fill className="rounded-full object-cover shadow-2xl" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-left text-heading3-bold text-light-1">{account.name}</h2>
                        <p className="text-base-medium text-gray-1">@{account.username}</p>
                    </div>
                </div>
            </div>
            <p className="mt-6 max-w-lg text-base-regular text-light-2">{account.bio}</p>
            <div className="mt-12 h-0.5 w-full bg-dark-3" />
        </div>
    );
};

export default ProfileHeader;
