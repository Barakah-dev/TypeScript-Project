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
exports.createUserSessionHandler = createUserSessionHandler;
exports.invalidateUserSessionHandler = invalidateUserSessionHandler;
exports.getUserSessionsHandler = getUserSessionsHandler;
const config_1 = __importDefault(require("config"));
const lodash_1 = require("lodash");
const userService_1 = require("../service/userService");
const sessionService_1 = require("../service/sessionService");
const jwtUtils_1 = require("../utils/jwtUtils");
function createUserSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validate the email and password
            const user = yield (0, userService_1.validatePassword)(req.body);
            if (!user) {
                res.status(401).send("Invalid username or password");
                return;
            }
            const userId = user._id.toString();
            // Create a session
            const session = yield (0, sessionService_1.createSession)(userId, req.get("user-agent") || "");
            // Create access token
            const accessToken = (0, sessionService_1.createAccessToken)({ user, session });
            // Create refresh token
            const refreshToken = (0, jwtUtils_1.sign)(session, {
                expiresIn: config_1.default.get("refreshTokenTtl"),
            });
            // Send refresh & access token back
            res.send({ accessToken, refreshToken });
        }
        catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while creating the session");
        }
    });
}
function invalidateUserSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sessionId = (0, lodash_1.get)(req, "user.session");
            if (!sessionId) {
                res.status(400).send("Session ID is missing");
                return;
            }
            // Invalidate the session
            yield (0, sessionService_1.updateSession)({ _id: sessionId }, { valid: false });
            res.sendStatus(200);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while invalidating the session");
        }
    });
}
function getUserSessionsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (0, lodash_1.get)(req, "user._id");
            if (!userId) {
                res.status(400).send("User ID is missing");
                return;
            }
            // Find active sessions for the user
            const sessions = yield (0, sessionService_1.findSessions)({ user: userId, valid: true });
            if (!sessions.length) {
                res.status(404).send("No active sessions found");
                return;
            }
            res.send(sessions);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while fetching sessions");
        }
    });
}
