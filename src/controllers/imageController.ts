// src/controllers/imageController.ts

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Function to get list of images
export const listImages = (req: Request, res: Response) => {
  const uploadDir = path.join(__dirname, '../../uploads');

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to retrieve images', error: err });
    }

    const imageUrls = files.map(file => `/uploads/${file}`);
    return res.status(200).json({ images: imageUrls });
  });
};

