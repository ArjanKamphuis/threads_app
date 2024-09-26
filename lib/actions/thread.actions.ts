"use server";

import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import { FetchThreadsReturnType, ThreadType } from "../types";
import Community from "../models/community.model";

type CreateThreadParams = {
    text: string;
    author: string;
    communityId: string | null;
    path: string;
};

export const createThread = async ({ text, author, communityId, path }: CreateThreadParams): Promise<void> => {
    try {
        await connectToDB();
        const community = (await Community.findOne({ id: communityId }))?._id || null;
        const createdThread = await Thread.create({ text, author, community });

        await User.findByIdAndUpdate(author, { $push: { threads: createdThread._id }});
        if (community) await Community.findByIdAndUpdate(community, { $push: { threads: createdThread._id }});

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
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: '_id name parentId image'
                }
            });
        
        const totalThreadsCount: number = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
        const threads: ThreadType[] = await threadsQuery.exec();
        const isNext: boolean = totalThreadsCount > skipAmount + threads.length;
        
        return { threads, isNext };
    } catch (error: unknown) {
        throw new Error(`Error fetching threads: ${error}`);
    }
};

export const fetchThreadById = async (id: string): Promise<ThreadType> => {
    try {
        await connectToDB();
        const thread = await Thread
            .findById(id)
            .populate({ path: 'author', model: User, select: '_id id name image' })
            .populate({
                path: 'children',
                populate: [
                    { path: 'author', model: User, select: '_id id name parentId image' },
                    {
                        path: 'children',
                        model: Thread,
                        populate: { path: 'author', model: User, select: '_id id name parentId image' }
                    }
                ]
            }).exec();        
        return thread;
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
