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
exports.createUserHandler = createUserHandler;
const lodash_1 = require("lodash");
const userService_1 = require("../service/userService");
const logger_1 = __importDefault(require("../logger"));
function createUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, userService_1.createUser)(req.body);
            res.send((0, lodash_1.omit)(user.toJSON(), "password"));
        }
        catch (e) {
            if (e instanceof Error) {
                logger_1.default.error(e);
                res.status(409).send(e.message);
            }
            else {
                logger_1.default.error('An unexpected error occurred');
                res.status(500).send('An unexpected error occurred');
            }
        }
    });
}
