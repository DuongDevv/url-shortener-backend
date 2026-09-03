import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { checkDbConnection } from './config/database.js';
import { createShortUrlHandler, redirectHandler } from './module/url/url.controller.js';
import { upload, uploadMediaHandler } from './module/media/media.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());

// Public static route for uploaded media
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.post('/api/v1/urls', createShortUrlHandler);
app.post('/api/v1/media/upload', upload.single('file'), uploadMediaHandler); // Media Upload Endpoint
app.get('/:shortKey', redirectHandler);

// Start Server
app.listen(PORT, async () => {
  console.log(`=================================`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`=================================`);
  await checkDbConnection();
});
