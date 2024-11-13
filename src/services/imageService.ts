// src/services/imageService.ts
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

export const getAllImages = () => {
  const imagePaths: string[] = [];

  const files = fs.readdirSync(UPLOAD_DIR);
  files.forEach(file => {
    imagePaths.push(path.join(UPLOAD_DIR, file));
  });

  return imagePaths;
};
