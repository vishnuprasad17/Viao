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
exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repo_1 = require("../data-access/auth.repo");
const signup = (email, password, name, phone) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield (0, auth_repo_1.findUserByEmail)(email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const isActive = true;
        const newUser = yield (0, auth_repo_1.createUser)({ email, password: hashedPassword, name, phone, isActive });
        const token = jsonwebtoken_1.default.sign({ _id: newUser._id }, process.env.JWT_SECRET);
        return { token: token, user: newUser };
    }
    catch (error) {
        throw error;
    }
});
exports.signup = signup;
