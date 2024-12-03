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
const signup = (email, password, name, phone, city) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingVendor = yield (0, auth_repo_1.findvendorByEmail)(email);
        if (existingVendor) {
            throw new Error("vendor already exists");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const isActive = true;
        const isVerified = false;
        const verificationRequest = false;
        const totalBooking = 0;
        const newVendor = yield (0, auth_repo_1.createVendor)({
            email,
            password: hashedPassword,
            name,
            phone,
            city,
            isActive,
            isVerified,
            verificationRequest,
            totalBooking,
        });
        const token = jsonwebtoken_1.default.sign({ _id: newVendor._id }, process.env.JWT_SECRET);
        return token;
    }
    catch (error) {
        throw error;
    }
});
exports.signup = signup;
