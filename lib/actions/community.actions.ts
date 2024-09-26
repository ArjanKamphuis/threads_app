"use server";

import Community from "../models/community.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { CommunityType } from "../types";

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

export const createCommunity = async ({ id, name, username, image, bio, createdById }: CreateCommunityParams): Promise<CommunityType> => {
    try {
        await connectToDB();
        const user = await User.findOne({ id: createdById });
        if (!user) throw new Error('User not found');

        const newCommunity = new Community({ id, name, username, image, bio, createdBy: user._id });
        const createdCommunity = await newCommunity.save();

        user.communities.push(createdCommunity._id);
        await user.save();

        return createdCommunity;
    } catch (error: unknown) {
        throw new Error(`Error creating community: ${error}`);
    }
};

export const fetchCommunityDetails = async () => {

};

export const fetchCommunityThreads = async () => {

};

export const fetchCommunities = async () => {

};

export const addMemberToCommunity = async (communityId: string, memberId: string): Promise<CommunityType> => {

};

export const removeUserFromCommunity = async (communityId: string, memberId: string) => {

};

export const updateCommunityInfo = async ({ id, name, username, image }: UpdateCommunityParams) => {

};

export const deleteCommunity = async (id: string) => {

};
