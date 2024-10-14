"use server";

import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { CommunityType, FetchCommunitiesReturnType } from "../types";

type CreateCommunityParams = {
    id: string;
    name: string;
    username: string;
    image: string;
    bio: string;
    createdById: string;
};

type UpdateCommunityParams = {
    id: string;
    name: string;
    username: string;
    image: string;
};

type FetchCommunitiesParams = {
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
};

export const createCommunity = async ({ id, name, username, image, bio, createdById }: CreateCommunityParams): Promise<CommunityType> => {
    try {
        await connectToDB();

        const user = await User.findOne({ id: createdById });
        if (!user) throw new Error('User not found');

        const newCommunity = new Community({ id, name, username, image, bio, createdBy: user._id });
        const createdCommunity = await newCommunity.save();

        return createdCommunity;
    } catch (error: unknown) {
        throw new Error(`Error creating community: ${error}`);
    }
};

export const fetchCommunityDetails = async (id: string): Promise<CommunityType> => {
    try {
        await connectToDB();
        return await Community
            .findOne({ id })
            .populate([
                'createdBy',
                { path: 'members', model: User, select: '_id id name username image ' }
            ]);
    } catch (error: unknown) {
        throw new Error(`Error fetching community details:  ${error}`);
    }
};

export const fetchCommunityThreads = async (id: string): Promise<CommunityType> => {
    try {
        await connectToDB();
        return await Community
            .findById(id)
            .populate({
                path: 'threads', model: Thread, populate: [
                    { path: 'author', model: User, select: 'id name image' },
                    {
                        path: 'children', model: Thread, populate: {
                            path: 'author', model: User, select: '_id image'
                        },
                        options: { sort: { createdAt: 'desc' } }
                    }
                ],
                options: { sort: { createdAt: 'desc' } }
            });
    } catch (error: unknown) {
        throw new Error(`Error fetching community threads: ${error}`);
    }
};

export const fetchCommunities = async ({ searchString = '', pageNumber = 1, pageSize = 20, sortBy = 'desc' }: FetchCommunitiesParams): Promise<FetchCommunitiesReturnType> => {
    try {
        await connectToDB();

        const skipAmount: number = (pageNumber - 1) * pageSize;
        const regex: RegExp = new RegExp(searchString, 'i');
        const query: FilterQuery<typeof Community> = {};

        if (searchString.trim()) {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ];
        }

        const communitiesQuery = Community
            .find(query)
            .sort({ createdAt: sortBy })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'members', model: User, select: 'image' });

        const totalCommunitiesCount: number = await Community.countDocuments(query);
        const communities: CommunityType[] = await communitiesQuery.exec();
        const isNext: boolean = totalCommunitiesCount > skipAmount + communities.length;

        return { communities, isNext };
    } catch (error: unknown) {
        throw new Error(`Error fetching communities: ${error}`);
    }
};

export const addMemberToCommunity = async (communityId: string, memberId: string): Promise<CommunityType> => {
    try {
        await connectToDB();

        const community = await Community.findOne({ id: communityId });
        if (!community) throw new Error(`Community with id: ${communityId} not found`);

        const user = await User.findOne({ id: memberId });
        if (!user) throw new Error(`User with id: ${memberId} not found`);
        if (community.members.includes(user._id)) throw new Error(`User: ${user.username} is already in community: ${community.name}`);

        community.members.push(user._id);
        await community.save();

        user.communities.push(community._id);
        await user.save();

        return community;
    } catch (error: unknown) {
        throw new Error(`Error adding member to community: ${error}`);
    }
};

export const removeUserFromCommunity = async (communityId: string, memberId: string): Promise<void> => {
    try {
        await connectToDB();

        const community = await Community.findOne({ id: communityId });
        if (!community) throw new Error(`Community with id: ${communityId} not found`);

        const user = await User.findOne({ id: memberId });
        if (!user) throw new Error(`User with id: ${memberId} not found`);
        if (!community.members.includes(user._id)) throw new Error(`User: ${user.username} is not in community: ${community.name}`);

        community.members.pull(user._id);
        await community.save();

        user.communities.pull(community._id);
        await user.save();
    } catch (error: unknown) {
        throw new Error(`Error removing member from community: ${error}`);
    }
};

export const updateCommunityInfo = async ({ id, name, username, image }: UpdateCommunityParams) => {
    try {
        await connectToDB();
        await Community.findOneAndUpdate({ id }, { name, username, image });
    } catch (error: unknown) {
        throw new Error(`Error updating community: ${error}`);
    }
};

export const deleteCommunity = async (id: string): Promise<void> => {
    try {
        await connectToDB();

        const community = await Community.findOneAndDelete({ id });
        if (!community) throw new Error(`Community with id: ${id} not found`);

        await Thread.deleteMany({ community: community._id });
        await User.updateMany(
            { communities: community._id },
            { $pull: { communities: community._id }}
        );
    } catch (error: unknown) {
        throw new Error(`Error removing community: ${error}`);
    }
};
