import { Request, Response } from 'express';
import { UrlService } from './url.service.js';

const urlService = new UrlService();

// POST /api/v1/urls - API Tạo link ngắn
export const createShortUrlHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { long_url, custom_alias, expires_at } = req.body || {};

    if (!long_url) {
      res.status(400).json({ success: false, message: 'long_url is required!' });
      return;
    }

    const result = await urlService.createShortUrl(
      long_url,
      custom_alias,
      undefined,
      expires_at ? new Date(expires_at) : undefined
    );

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.status(201).json({
      success: true,
      data: {
        short_key: result.short_key,
        short_url: `${baseUrl}/${result.short_key}`,
        long_url: result.long_url,
        created_at: result.created_at,
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

// GET /:shortKey - API Redirect người dùng về Link Gốc
export const redirectHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortKey } = req.params;
    const longUrl = await urlService.getLongUrl(shortKey as string);

    if (!longUrl) {
      res.status(404).send('<h1>404 - Short URL Not Found or Expired</h1>');
      return;
    }

    // HTTP 302 Found (Temporary Redirect)
    res.redirect(302, longUrl);
  } catch (error: unknown) {
    res.status(500).send('Internal Server Error');
  }
};
