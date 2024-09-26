"use server";

import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { revalidatePath } from "next/cache";
import { FetchActivityReturnType, FetchUsersReturnType, ThreadType, UserType } from "../types";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

type UpdateParams = {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
};

type fetchUsersParams = {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
};

export const updateUser = async ({ userId, username, name, bio, image, path }: UpdateParams): Promise<void> => {
    try {
        await connectToDB();

        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            { upsert: true }
        );

        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: unknown) {
        throw new Error(`Failed to create/update user: ${error}`);
    }
};

export const fetchUser = async (userId: string): Promise<UserType | undefined> => {
    try {
        await connectToDB();
        return await User.findOne({ id: userId }) as UserType;
    } catch (error: unknown) {
        throw new Error(`Failed to fetch user: ${error}`);
    }
};

export const fetchUsers = async({ userId, searchString = '', pageNumber = 1, pageSize = 20, sortBy = 'desc' }: fetchUsersParams): Promise<FetchUsersReturnType> => {
    try {
        await connectToDB();

        const skipAmount: number = (pageNumber - 1) * pageSize;
        const regex: RegExp = new RegExp(searchString, 'i');

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        };

        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ];
        }

        const sortOptions = { createdAt: sortBy };

        const usersQuery = User
            .find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);
        
        const totalUsersCount: number = await User.countDocuments(query);
        const users: UserType[] = await usersQuery.exec();
        const isNext: boolean = totalUsersCount > skipAmount + users.length;

        return { users, isNext };
    } catch (error: unknown) {
        throw new Error(`Error fetching users: ${error}`);
    }
};

export const fetchUserThreads = async (userId: string): Promise<UserType | undefined> => {
    try {
        await connectToDB();
        return await User
            .findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            }) as UserType;
    } catch (error: unknown) {
        throw new Error(`Failed to fetch user threads: ${error}`);
    }
};

export const fetchActivity = async (userId: string): Promise<FetchActivityReturnType[]> => {
    try {
        await connectToDB();

        const userThreads: ThreadType[] = await Thread.find({ author: userId });
        const childrenThreadIds = userThreads.reduce<string[]>((acc, userThread) => (
            acc.concat(userThread.children.map(child => child._id))
        ), []);
        const replies: FetchActivityReturnType[] = await Thread
            .find({ _id: { $in: childrenThreadIds }, author: { $ne: userId }})
            .populate({ path: 'author', model: User, select: 'name image _id' });

        return replies;
    } catch (error: unknown) {
        throw new Error(`Failed to fetch activity: ${error}`);
    }
};
