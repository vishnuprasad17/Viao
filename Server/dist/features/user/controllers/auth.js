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
exports.UserAuthController = void 0;
const signup_service_1 = require("../services/signup.service");
const login_service_1 = require("../services/login.service");
const auth_schema_1 = require("../schemas/auth.schema");
exports.UserAuthController = {
    UserSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, name, phone } = req.body;
                // validating input
                const { error } = auth_schema_1.userSignupSchema.validate(req.body);
                if (error) {
                    res.status(400).json({ message: error.details[0].message });
                    return;
                }
                const user = yield (0, signup_service_1.signup)(email, password, name, phone);
                res.status(201).json(user);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server Error" });
            }
        });
    },
    UserLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // validating input
                const { error } = auth_schema_1.userLoginSchema.validate(req.body);
                if (error) {
                    res.status(400).json({ message: error.details[0].message });
                    return;
                }
                const { token, userData, message } = yield (0, login_service_1.login)(email, password);
                res.cookie('jwtToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.status(200).json({ token, userData, message });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Server Error" });
            }
        });
    },
    UserLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('jwtToken');
                res.status(200).json({ message: "User logged out successfully" });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Server Error" });
            }
        });
    },
};
