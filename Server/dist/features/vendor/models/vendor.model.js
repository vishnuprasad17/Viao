"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VendorSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    city: { type: String, required: true },
    about: { type: String },
    logo: { type: String },
    coverpic: { type: String },
    reviews: { type: Object },
    isVerified: { type: Boolean },
    verificationRequest: { type: Boolean },
    totalBooking: { type: Number },
    vendorType: { type: mongoose_1.Schema.Types.ObjectId },
    isActive: { type: Boolean }
});
exports.default = (0, mongoose_1.model)('Vendor', VendorSchema);
