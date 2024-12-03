"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    isAdmin: { type: Boolean, required: true },
});
exports.default = (0, mongoose_1.model)('Admin', adminSchema);
