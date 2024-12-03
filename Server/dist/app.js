"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const configDB_1 = require("./database/configDB");
const auth_routes_1 = __importDefault(require("./features/admin/routes/auth.routes"));
const auth_routes_2 = __importDefault(require("./features/user/routes/auth.routes"));
const vendor_routes_1 = __importDefault(require("./features/vendor/routes/vendor.routes"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config();
(0, configDB_1.initializeDatabase)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use('/api', auth_routes_1.default);
app.use('/api', auth_routes_2.default);
app.use('/api', vendor_routes_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
