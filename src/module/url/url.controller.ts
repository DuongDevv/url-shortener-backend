import { Request, Response } from "express";
import { UrlService } from "./url.service.js";

const urlService = new UrlService();

// POST /api/v1/urls - API Tao link ngan
export const createShortUrlHandler =  async (req: Request, res: Response): Promise<void> => {
    try{
        const { long_url, custom_alias, expires_at } = req.body || {};

        if(!long_url){
            res.status(400).json({success: false, message: 'long_url is required'});
            return;
        }

        const result = await urlService.createShortUrl(long_url, custom_alias, undefined, expires_at ? new Date(expires_at) : undefined);

        const baseURL = `${req.protocol}://${req.get('host')}`;
        res.status(201).json({
            success: true,
            data: {
                short_key: result.short_key,
                short_url: `${baseURL}/${result.short_key}`,
                long_url: result.long_url,
                created_at: result.created_at,
            },
        });
    }catch(error: any){
        if(error.message === 'CUSTOM_ALIAS_ALREADY_EXISTS'){
            res.status(409).json({success: false, message: 'Custom alias already in use!'});
            return;
        }
        res.status(500).json({success: false, message: 'Internal Server Error', error: error.message});
    }
};

// GET /:shortKey - API Redirect Huong nguoi dung ve link goc
export const redirectHandler = async (req: Request, res: Response): Promise<void> => {
    try{
        const { shortKey } = req.params;
        const longUrl = await urlService.getLongUrl(shortKey as string);

        if(!longUrl){
            res.status(404).send('<h1>404 - Short URL Not Found or Expired</h1>');
            return;
        }

        // HTTP 302 Found (Temporary Redirect)
        res.redirect(302, longUrl);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};