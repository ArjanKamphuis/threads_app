export type UserType = {
    _id: string;
    id: string;
    username: string;
    name: string;
    image: string;
    bio: string;
    threads: ThreadType[];
    onboarded: boolean;
    communities: CommunityType[];
};

export type ThreadType = {
    _id: string;
    text: string;
    author: UserType;
    community: CommunityType | null;
    createdAt: Date;
    parentId: string | null;
    children: ThreadType[];
};

export type CommunityType = {
    _id: string;
    id: string;
    username: string;
    name: string;
    image: string;
    bio: string;
    createdBy: UserType;
    threads: ThreadType[];
    members: UserType[];
};

export type FetchThreadsReturnType = {
    threads: ThreadType[];
    isNext: boolean;
};

export type FetchUsersReturnType = {
    users: UserType[];
    isNext: boolean;
};

export type FetchActivityReturnType = {
    _id: string;
    text: string;
    author: {
        _id: string;
        name: string;
        image: string;
    };
    community: CommunityType | null;
    parentId: string;
    children: ThreadType[];
    createdAt: Date;
};
