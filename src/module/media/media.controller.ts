import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { UrlService } from '../url/url.service.js';

const urlService = new UrlService();

// Ensure 'uploads' directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer disk storage with unique filename
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `media-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB Max file size limit
});

// Handler: Upload Photo/Video & Generate Short Link
export const uploadMediaHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Please attach an image or video file!' });
      return;
    }

    const { custom_alias, expires_at } = req.body || {};
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // 1. Construct public Media Long URL
    const mediaLongUrl = `${baseUrl}/uploads/${req.file.filename}`;

    // 2. Pass Long URL through Base62 Shortener Engine
    const result = await urlService.createShortUrl(
      mediaLongUrl,
      custom_alias,
      undefined,
      expires_at ? new Date(expires_at) : undefined
    );

    res.status(201).json({
      success: true,
      message: 'Upload and short link generation successful!',
      data: {
        short_key: result.short_key,
        short_url: `${baseUrl}/${result.short_key}`,
        media_url: mediaLongUrl,
        filename: req.file.filename,
        size_bytes: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    if (errMessage === 'CUSTOM_ALIAS_ALREADY_EXISTS') {
      res.status(409).json({ success: false, message: 'Custom alias already in use!' });
      return;
    }
    res.status(500).json({ success: false, message: 'Internal Server Error', error: errMessage });
  }
};
