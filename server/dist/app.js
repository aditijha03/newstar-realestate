"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = __importDefault(require("./routes/auth"));
const property_1 = __importDefault(require("./routes/property"));
const enquiry_1 = __importDefault(require("./routes/enquiry"));
const upload_1 = __importDefault(require("./routes/upload"));
const Contact_1 = __importDefault(require("./routes/Contact"));
const error_1 = require("./middleware/error");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
// Ensure uploads folder exists for local fallback storage
const uploadsDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Security headers
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false // Allows loading local static files in browser
}));
// CORS Configuration
app.use((0, cors_1.default)({
    origin: [env_1.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Compression
app.use((0, compression_1.default)());
// Parsers
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use((0, cookie_parser_1.default)());
// Request logger
app.use((0, morgan_1.default)('dev'));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per windowMs
    message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);
// Serve static uploads (local fallback)
app.use('/uploads', express_1.default.static(uploadsDir));
// API Routers
app.use('/api/auth', auth_1.default);
app.use('/api/properties', property_1.default);
app.use('/api/enquiries', enquiry_1.default);
app.use('/api/upload', upload_1.default);
app.use('/api/contact', Contact_1.default);
// Centralized error handling
app.use(error_1.errorHandler);
exports.default = app;
