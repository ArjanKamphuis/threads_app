"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type UserCardProps = {
    id: string;
    name: string;
    username: string;
    image: string;
    personType?: 'User';
};

const UserCard = ({ id, name, username, image, personType }: UserCardProps): React.JSX.Element => {
    const router = useRouter();
    return (
        <article className="user-card">
            <div className="user-card_avatar">
                <Image src={image} alt="Logo" width={48} height={48} className="rounded-full" />
                <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-light-1">{name}</h4>
                    <p className="text-small-medium text-gray-1">@{username}</p>

                </div>
            </div>
            <Button className="user-card_btn" onClick={() => router.push(`/profiles/${id}`)}>View</Button>
        </article>
    );
};

export default UserCard;
