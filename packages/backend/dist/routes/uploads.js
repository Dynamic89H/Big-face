"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, config_1.config.uploadDir),
    filename: (_req, file, cb) => {
        // Randomized name; keep the original extension for correct content types.
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${crypto_1.default.randomBytes(8).toString('hex')}${ext}`);
    },
});
function fileFilter(_req, file, cb) {
    if (/^(image|video|audio)\//.test(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new util_1.HttpError(400, 'Only image, video, or audio files are allowed'));
    }
}
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: config_1.config.maxUploadMb * 1024 * 1024 },
});
router.post('/', auth_1.requireAuth, upload.single('file'), (0, util_1.asyncHandler)(async (req, res) => {
    const file = req.file;
    if (!file)
        throw new util_1.HttpError(400, 'No file uploaded (field name: "file")');
    res.status(201).json({
        url: `/uploads/${file.filename}`,
        name: file.originalname,
        mime: file.mimetype,
        size: file.size,
    });
}));
exports.default = router;
