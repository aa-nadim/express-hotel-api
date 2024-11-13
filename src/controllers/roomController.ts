// src/controllers/roomController.ts

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const getAllRooms = (req: Request, res: Response) => {
  const dataDir = path.join(__dirname, '../data');
  const rooms: any[] = [];

  fs.readdir(dataDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading room data files', error: err });
    }

    files.forEach((file) => {
      if (file.endsWith('.json')) {
        const filePath = path.join(dataDir, file);
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        if (fileData.rooms && Array.isArray(fileData.rooms)) {
          rooms.push(...fileData.rooms);
        }
      }
    });

    return res.status(200).json({ rooms });
  });
};



