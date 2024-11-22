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
const lodash_1 = require("lodash");
const jwtUtils_1 = require("../utils/jwtUtils");
const sessionService_1 = require("../service/sessionService");
const deserializeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (0, lodash_1.get)(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    const refreshToken = (0, lodash_1.get)(req, "headers.x-refresh");
    if (!accessToken)
        return next();
    const { decoded, expired } = (0, jwtUtils_1.decode)(accessToken);
    if (decoded) {
        req.user = decoded;
        return next();
    }
    if (expired && typeof refreshToken === "string") {
        try {
            const newAccessToken = yield (0, sessionService_1.reIssueAccessToken)({ refreshToken });
            if (newAccessToken) {
                res.setHeader("x-access-token", newAccessToken);
                const { decoded } = (0, jwtUtils_1.decode)(newAccessToken);
                req.user = decoded;
            }
        }
        catch (error) {
            res.status(500).send({ message: "Could not refresh token." });
            return;
        }
        return next();
    }
    res.status(401).send({ message: "Unauthorized" });
    return;
});
exports.default = deserializeUser;
