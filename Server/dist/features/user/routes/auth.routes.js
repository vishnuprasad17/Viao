"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.post('user/signup', auth_1.UserAuthController.UserSignup);
router.post('user/login', auth_1.UserAuthController.UserLogin);
router.get('user/logout', auth_1.UserAuthController.UserLogout);
exports.default = router;
