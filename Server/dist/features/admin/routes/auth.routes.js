"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.post('admin/login', auth_1.AdminAuthController.Adminlogin);
router.get('admin/logout', auth_1.AdminAuthController.Adminlogout);
exports.default = router;
