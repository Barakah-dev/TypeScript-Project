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
exports.createSession = createSession;
exports.createAccessToken = createAccessToken;
exports.reIssueAccessToken = reIssueAccessToken;
exports.updateSession = updateSession;
exports.findSessions = findSessions;
const config_1 = __importDefault(require("config"));
const lodash_1 = require("lodash");
const sessionModel_1 = __importDefault(require("../model/sessionModel"));
const jwtUtils_1 = require("../utils/jwtUtils");
const userService_1 = require("./userService");
function createSession(userId, userAgent) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = yield sessionModel_1.default.create({ user: userId, userAgent });
            return session.toJSON();
        }
        catch (error) {
            throw new Error(`Error creating session: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
}
function createAccessToken({ user, session, }) {
    try {
        // Build and return the new access token
        const accessToken = (0, jwtUtils_1.sign)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("accessTokenTtl") });
        return accessToken;
    }
    catch (error) {
        throw new Error(`Error creating access token: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
function reIssueAccessToken(_a) {
    return __awaiter(this, arguments, void 0, function* ({ refreshToken, }) {
        try {
            // Decode the refresh token
            const { decoded } = (0, jwtUtils_1.decode)(refreshToken);
            // Ensure `decoded` is valid and has a session ID
            if (!decoded || typeof decoded !== "object" || !(0, lodash_1.get)(decoded, "_id")) {
                return false;
            }
            // Get the session
            const session = yield sessionModel_1.default.findById((0, lodash_1.get)(decoded, "_id"));
            // Make sure the session is still valid
            if (!session || !session.valid) {
                return false;
            }
            // Find the user
            const user = yield (0, userService_1.findUser)({ _id: session.user });
            if (!user) {
                return false;
            }
            // Generate and return a new access token
            const accessToken = createAccessToken({ user: user, session });
            return accessToken;
        }
        catch (error) {
            throw new Error(`Error reissuing access token: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
}
function updateSession(query, update) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield sessionModel_1.default.updateOne(query, update);
        }
        catch (error) {
            throw new Error(`Error updating session: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
}
function findSessions(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield sessionModel_1.default.find(query).lean();
        }
        catch (error) {
            throw new Error(`Error finding sessions: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
}
