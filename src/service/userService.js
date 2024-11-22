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
exports.createUser = createUser;
exports.findUser = findUser;
exports.validatePassword = validatePassword;
const lodash_1 = require("lodash");
const userModel_1 = __importDefault(require("../model/userModel"));
function createUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield userModel_1.default.create(input);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new Error(`Error creating user: ${errorMessage}`);
        }
    });
}
function findUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield userModel_1.default.findOne(query).lean();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new Error(`Error finding user: ${errorMessage}`);
        }
    });
}
function validatePassword(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, password, }) {
        try {
            // Find user by email
            const user = yield userModel_1.default.findOne({ email });
            if (!user) {
                return false;
            }
            // Compare password
            const isValid = yield user.comparePassword(password);
            if (!isValid) {
                return false;
            }
            // Return user object without the password field
            return (0, lodash_1.omit)(user.toJSON(), "password");
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new Error(`Error validating password: ${errorMessage}`);
        }
    });
}
