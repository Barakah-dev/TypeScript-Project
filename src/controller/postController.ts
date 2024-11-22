import { Request, Response } from "express";
import {
  createPost,
  findPost,
  findAndUpdate,
  deletePost,
} from "../service/postService";

export async function createPostHandler(req: Request, res: Response): Promise<void> {
  try {
    // const { _id: userId } = req.user;
    const { _id: userId } = req.user as { _id: string }; 
    const body = req.body;

    const post = await createPost({ ...body, user: userId });

    res.status(201).send(post);
  } catch (error) {
    res.status(500).send({ message: "Failed to create post", error });
  }
}

export async function updatePostHandler(req: Request, res: Response): Promise<void> {
  try {
    // const { _id: userId } = req.user;
    const { _id: userId } = req.user as { _id: string }; 
    const { postId } = req.params;
    const update = req.body;

    const post = await findPost({ postId });

    if (!post) {
      res.status(404).send({ message: "Post not found" });
      return;
    }

    if (String(post.user) !== userId) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    const updatedPost = await findAndUpdate({ postId }, update, { new: true });

    res.status(200).send(updatedPost);
  } catch (error) {
    res.status(500).send({ message: "Failed to update post", error });
  }
}

export async function getPostHandler(req: Request, res: Response): Promise<void> {
  try {
    const { postId } = req.params;
    const post = await findPost({ postId });

    if (!post) {
      res.status(404).send({ message: "Post not found" });
    }

    res.status(200).send(post);
  } catch (error) {
    res.status(500).send({ message: "Failed to get post", error });
  }
}

export async function deletePostHandler(req: Request, res: Response): Promise<void> {
  try {
    // const { _id: userId } = req.user;
    const { _id: userId } = req.user as { _id: string }; 
    const { postId } = req.params;

    const post = await findPost({ postId });

    if (!post) {
      res.status(404).send({ message: "Post not found" });
      return;
    }

    if (String(post.user) !== String(userId)) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    await deletePost({ postId });

    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete post", error });
  }
}
