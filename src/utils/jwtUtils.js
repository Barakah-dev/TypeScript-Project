"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = sign;
exports.decode = decode;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const privateKey = config_1.default.get("privateKey");
function sign(object, options) {
    return jsonwebtoken_1.default.sign(object, privateKey, options);
}
function decode(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, privateKey);
        return { valid: true, expired: false, decoded };
    }
    catch (error) {
        if (error instanceof Error) {
            return {
                valid: false,
                expired: error.message === "jwt expired",
                decoded: null,
            };
        }
        return {
            valid: false,
            expired: false,
            decoded: null,
        };
    }
}
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import config from "config";
// const privateKey = config.get<string>("privateKey");
// export function authenticate(req: Request, res: Response, next: NextFunction) {
//   const token = req.header("Authorization")?.replace("Bearer ", "");
//   if (!token) {
//     return res.status(401).send({ message: "Access denied" });
//   }
//   try {
//     const decoded = jwt.verify(token, privateKey);
//     req.user = decoded; // Attach decoded token to the request object
//     next();
//   } catch (error) {
//     return res.status(400).send({ message: "Invalid token" });
//   }
// }
