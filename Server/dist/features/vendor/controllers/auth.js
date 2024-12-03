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
exports.VendorController = void 0;
const signup_service_1 = require("../services/signup.service");
const login_service_1 = require("../services/login.service");
exports.VendorController = {
    vendorSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, name, phone, city } = req.body;
                const vendor = yield (0, signup_service_1.signup)(email, password, name, phone, city);
                res.status(201).json(vendor);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Server Error' });
            }
        });
    },
    VendorLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { token, vendorData, message } = yield (0, login_service_1.login)(email, password);
                res.cookie('jwtToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.status(200).json({ token, vendorData, message });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Server Error" });
            }
        });
    },
    VendorLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('jwtToken');
                res.status(200).json({ message: 'vendor logged out successfully' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
};
