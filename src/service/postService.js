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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
exports.findPost = findPost;
exports.findAndUpdate = findAndUpdate;
exports.deletePost = deletePost;
const postModel_1 = __importDefault(require("../model/postModel"));
function createPost(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield postModel_1.default.create(input);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error creating post: ${error.message}`);
            }
            throw new Error("Unknown error occurred while creating post");
        }
    });
}
function findPost(query_1) {
    return __awaiter(this, arguments, void 0, function* (query, options = { lean: true }) {
        try {
            return yield postModel_1.default.findOne(query, {}, options);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error finding post: ${error.message}`);
            }
            throw new Error("Unknown error occurred while finding post");
        }
    });
}
function findAndUpdate(query, update, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield postModel_1.default.findOneAndUpdate(query, update, options);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error updating post: ${error.message}`);
            }
            throw new Error("Unknown error occurred while updating post");
        }
    });
}
function deletePost(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield postModel_1.default.deleteOne(query);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error deleting post: ${error.message}`);
            }
            throw new Error("Unknown error occurred while deleting post");
        }
    });
}
