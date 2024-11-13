// src/config/config.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  uploadDir: path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads'),
  dataDir: path.join(process.cwd(), 'data'),
  dataFile: path.join(process.cwd(), 'data', 'data.json'),
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
  maxImagesPerUpload: 10
};

export default config;