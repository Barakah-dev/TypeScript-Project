"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostHandler = createPostHandler;
exports.updatePostHandler = updatePostHandler;
exports.getPostHandler = getPostHandler;
exports.deletePostHandler = deletePostHandler;
const postService_1 = require("../service/postService");
function createPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const { _id: userId } = req.user;
            const { _id: userId } = req.user;
            const body = req.body;
            const post = yield (0, postService_1.createPost)(Object.assign(Object.assign({}, body), { user: userId }));
            res.status(201).send(post);
        }
        catch (error) {
            res.status(500).send({ message: "Failed to create post", error });
        }
    });
}
function updatePostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const { _id: userId } = req.user;
            const { _id: userId } = req.user;
            const { postId } = req.params;
            const update = req.body;
            const post = yield (0, postService_1.findPost)({ postId });
            if (!post) {
                res.status(404).send({ message: "Post not found" });
                return;
            }
            if (String(post.user) !== userId) {
                res.status(401).send({ message: "Unauthorized" });
                return;
            }
            const updatedPost = yield (0, postService_1.findAndUpdate)({ postId }, update, { new: true });
            res.status(200).send(updatedPost);
        }
        catch (error) {
            res.status(500).send({ message: "Failed to update post", error });
        }
    });
}
function getPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { postId } = req.params;
            const post = yield (0, postService_1.findPost)({ postId });
            if (!post) {
                res.status(404).send({ message: "Post not found" });
            }
            res.status(200).send(post);
        }
        catch (error) {
            res.status(500).send({ message: "Failed to get post", error });
        }
    });
}
function deletePostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const { _id: userId } = req.user;
            const { _id: userId } = req.user;
            const { postId } = req.params;
            const post = yield (0, postService_1.findPost)({ postId });
            if (!post) {
                res.status(404).send({ message: "Post not found" });
                return;
            }
            if (String(post.user) !== String(userId)) {
                res.status(401).send({ message: "Unauthorized" });
                return;
            }
            yield (0, postService_1.deletePost)({ postId });
            res.status(200).send({ message: "Post deleted successfully" });
        }
        catch (error) {
            res.status(500).send({ message: "Failed to delete post", error });
        }
    });
}
