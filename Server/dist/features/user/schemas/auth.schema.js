"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginSchema = exports.userSignupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Schema for User Signup
exports.userSignupSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Invalid email format.',
        'string.empty': 'Email is required.',
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters.',
        'string.empty': 'Password is required.',
    }),
    name: joi_1.default.string().min(3).required().messages({
        'string.min': 'Name must be at least 3 characters.',
        'string.empty': 'Name is required.',
    }),
    phone: joi_1.default.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
        'string.pattern.base': 'Phone number must be 10 digits.',
        'string.empty': 'Phone number is required.',
    }),
});
// Schema for User Login
exports.userLoginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Invalid email format.',
        'string.empty': 'Email is required.',
    }),
    password: joi_1.default.string().required().messages({
        'string.empty': 'Password is required.',
    }),
});
