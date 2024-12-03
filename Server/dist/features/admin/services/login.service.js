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
exports.adminLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repo_1 = require("../data-access/auth.repo");
const adminLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingAdmin = yield (0, auth_repo_1.findAdminByEmail)(email);
        if (!existingAdmin) {
            throw new Error('Admin not found');
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, existingAdmin.password);
        if (!passwordMatch) {
            throw new Error('Incorrect password');
        }
        const token = jsonwebtoken_1.default.sign({ _id: existingAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { token, adminData: existingAdmin, message: "Successfully logged in.." };
    }
    catch (error) {
        throw error;
    }
});
exports.adminLogin = adminLogin;
