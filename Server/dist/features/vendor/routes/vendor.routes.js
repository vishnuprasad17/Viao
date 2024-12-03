"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.post('vendor/signup', auth_1.VendorController.vendorSignup);
router.post('vendor/login', auth_1.VendorController.VendorLogin);
router.get('vendor/logout', auth_1.VendorController.VendorLogout);
exports.default = router;
