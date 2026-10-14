import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (_req, file, cb) => {
    // Randomized name; keep the original extension for correct content types.
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
  },
});

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void {
  if (/^(image|video|audio)\//.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new HttpError(400, 'Only image, video, or audio files are allowed'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxUploadMb * 1024 * 1024 },
});

router.post(
  '/',
  requireAuth,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) throw new HttpError(400, 'No file uploaded (field name: "file")');
    res.status(201).json({
      url: `/uploads/${file.filename}`,
      name: file.originalname,
      mime: file.mimetype,
      size: file.size,
    });
  })
);

export default router;
