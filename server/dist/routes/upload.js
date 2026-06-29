"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../middleware/upload");
const auth_1 = require("../middleware/auth");
const cloudinary_1 = require("../config/cloudinary");
const router = (0, express_1.Router)();
// Single upload
router.post('/single', auth_1.authMiddleware, upload_1.upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        let fileUrl = '';
        if (cloudinary_1.isCloudinaryConfigured) {
            fileUrl = await (0, cloudinary_1.uploadToCloudinary)(req.file.path);
        }
        else {
            // Local fallback url (dynamic host detection)
            const protocol = req.protocol;
            const host = req.get('host');
            fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        }
        res.json({
            success: true,
            url: fileUrl,
        });
    }
    catch (error) {
        next(error);
    }
});
// Multiple gallery uploads
router.post('/gallery', auth_1.authMiddleware, upload_1.upload.array('images', 15), async (req, res, next) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }
        const uploadPromises = files.map(async (file) => {
            if (cloudinary_1.isCloudinaryConfigured) {
                return await (0, cloudinary_1.uploadToCloudinary)(file.path);
            }
            else {
                const protocol = req.protocol;
                const host = req.get('host');
                return `${protocol}://${host}/uploads/${file.filename}`;
            }
        });
        const urls = await Promise.all(uploadPromises);
        res.json({
            success: true,
            urls,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
