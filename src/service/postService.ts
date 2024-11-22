import {
  HydratedDocument,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Post, { PostDocument } from "../model/postModel";

export async function createPost(
  input: HydratedDocument<Omit<PostDocument, "createdAt" | "updatedAt">>
) {
  try {
    return await Post.create(input);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error creating post: ${error.message}`);
    }
    throw new Error("Unknown error occurred while creating post");
  }
}

export async function findPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
) {
  try {
    return await Post.findOne(query, {}, options);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error finding post: ${error.message}`);
    }
    throw new Error("Unknown error occurred while finding post");
  }
}

export async function findAndUpdate(
  query: FilterQuery<PostDocument>,
  update: UpdateQuery<PostDocument>,
  options: QueryOptions
) {
  try {
    return await Post.findOneAndUpdate(query, update, options);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error updating post: ${error.message}`);
    }
    throw new Error("Unknown error occurred while updating post");
  }
}

export async function deletePost(query: FilterQuery<PostDocument>) {
  try {
    return await Post.deleteOne(query);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error deleting post: ${error.message}`);
    }
    throw new Error("Unknown error occurred while deleting post");
  }
}
