"use server";

import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import { FetchThreadByIdReturnType, FetchThreadsReturnType, ThreadType } from "../types";
import Community from "../models/community.model";

type CreateThreadParams = {
    text: string;
    author: string;
    communityId: string | null;
    path: string;
};

type FetchThreadByIdParams = {
    id: string;
    pageNumber?: number;
    pageSize?: number;
};

export const createThread = async ({ text, author, communityId, path }: CreateThreadParams): Promise<void> => {
    try {
        await connectToDB();
        const community = (await Community.findOne({ id: communityId }))?._id || null;
        const createdThread = await Thread.create({ text, author, community });

        await User.findByIdAndUpdate(author, { $push: { threads: createdThread._id } });
        if (community) await Community.findByIdAndUpdate(community, { $push: { threads: createdThread._id } });

        revalidatePath(path);
    } catch (error: unknown) {
        throw new Error(`Error creating thread: ${error}`);
    }
};

export const fetchThreads = async (pageNumber: number = 1, pageSize: number = 20): Promise<FetchThreadsReturnType> => {
    try {
        await connectToDB();

        const skipAmount: number = (pageNumber - 1) * pageSize;

        const threadsQuery = Thread
            .find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({ path: 'community', model: Community })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: '_id name parentId image'
                },
                options: { sort: { createdAt: 'desc' } }
            });

        const totalThreadsCount: number = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
        const threads: ThreadType[] = await threadsQuery.exec();
        const isNext: boolean = totalThreadsCount > skipAmount + threads.length;

        return { threads, isNext };
    } catch (error: unknown) {
        throw new Error(`Error fetching threads: ${error}`);
    }
};

export const fetchThreadById = async ({ id, pageNumber = 1, pageSize = 20 }: FetchThreadByIdParams): Promise<FetchThreadByIdReturnType> => {
    try {
        await connectToDB();

        const skipAmount: number = (pageNumber - 1) * pageSize;

        const thread = await Thread
            .findById(id)
            .populate({ path: 'author', model: User, select: '_id id name image' })
            .populate({ path: 'community', model: Community, select: '_id id name image' })
            .populate({
                path: 'children',
                model: Thread,
                select: 'author',
                populate: { path: 'author', model: User, select: 'image' },
                options: { sort: { createdAt: 'desc' } }
            });

        const comments = await Thread
            .find({ parentId: id })
            .populate([
                { path: 'author', model: User, select: '_id id name parentId image' },
                {
                    path: 'children',
                    model: Thread,
                    select: 'author',
                    populate: { path: 'author', model: User, select: '_id id name parentId image' }
                }
            ])
            .sort({ createdAt: 'desc' })
            .limit(pageSize)
            .skip(skipAmount);

        const isNext: boolean = thread?.children.length > skipAmount + comments.length;
        return { thread, comments, isNext };
    } catch (error: unknown) {
        throw new Error(`Error fetching thread: ${error}`);
    }
};

export const addCommentToThread = async (threadId: string, commentText: string, userId: string, path: string): Promise<void> => {
    try {
        await connectToDB();
        const originalThread = await Thread.findById(threadId);
        if (!originalThread) throw new Error('Thread not found');
        const commentThread = new Thread({ text: commentText, author: userId, community: originalThread.community, parentId: originalThread._id, });
        const savedCommentThread = await commentThread.save();
        originalThread.children.push(savedCommentThread._id);
        await originalThread.save();
        revalidatePath(path);
    } catch (error: unknown) {
        throw new Error(`Error adding comment to thread: ${error}`);
    }
};

const fetchAllChildThreads = async (id: string): Promise<unknown[]> => {
    const childThreads = await Thread.find({ parentId: id });
    const descendantThreads = [];
    for (const child of childThreads) {
        const descendants = await fetchAllChildThreads(child._id);
        descendantThreads.push(child, ...descendants);
    }
    return descendantThreads;
};

export const deleteThread = async (id: string, path: string): Promise<void> => {
    try {
        await connectToDB();

        const mainThread: ThreadType = await Thread.findById(id).populate('author community');
        if (!mainThread) throw new Error('Thread not found');

        const childrenThreads = (await fetchAllChildThreads(id)) as ThreadType[];
        const allThreadIds: string[] = [id, ...childrenThreads.map(child => child._id)];

        const uniqueAuthorIds = new Set([
            ...childrenThreads.map(child => child.author._id.toString()),
            mainThread.author._id.toString()
        ]);
        const uniqueCommunityIds = new Set([
            ...childrenThreads.map(child => child.community?._id.toString()),
            mainThread.community?._id.toString()
        ].filter(id => id !== undefined));

        await Thread.deleteMany({ _id: { $in: allThreadIds }});
        await User.updateMany({ _id: { $in: Array.from(uniqueAuthorIds) }} , { $pull: { threads: { $in: allThreadIds } } });
        await Community.updateMany({ _id: { $in: Array.from(uniqueCommunityIds) }} , { $pull: { threads: { $in: allThreadIds } } });
        
        revalidatePath(path, 'page');
    } catch (error: unknown) {
        throw new Error(`Error deleting thread: ${error}`);
    }
};
