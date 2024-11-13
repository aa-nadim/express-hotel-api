// src/controllers/hotelController.ts
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';  // Using uuid for unique hotel-id generation
import multer from 'multer';

const dataDir = path.join(__dirname, '../data');  // Directory where the hotel JSON files will be saved

// Make sure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

export const getAllHotels = (req: Request, res: Response) => {
  const files = fs.readdirSync(dataDir);
  const hotels = files.map((file) => {
    const filePath = path.join(dataDir, file);
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
  });
  res.status(200).json(hotels);
};

export const getHotelById = (req: Request, res: Response) => {
  const { hotelId } = req.params;
  const filePath = path.join(dataDir, `${hotelId}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  const hotelData = fs.readFileSync(filePath, 'utf-8');
  res.status(200).json(JSON.parse(hotelData));
};

export const createHotel = (req: Request, res: Response) => {
  const hotelData = req.body;
  const hotelId = uuidv4();  // Create a unique hotel ID
  const hotelFilePath = path.join(dataDir, `${hotelId}.json`);

  // Save the hotel data in the corresponding file
  fs.writeFileSync(hotelFilePath, JSON.stringify(hotelData, null, 2));

  res.status(201).json({ hotelId, ...hotelData });
};

// Update hotel data
export const updateHotel = (req: Request, res: Response) => {
  const { hotelId } = req.params;
  const hotelPath = path.join(dataDir, `${hotelId}.json`);

  // Check if hotel file exists
  if (!fs.existsSync(hotelPath)) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  try {
    // Read existing hotel data
    const existingData = JSON.parse(fs.readFileSync(hotelPath, 'utf-8'));

    // Merge existing data with incoming data
    const updatedData = { ...existingData, ...req.body };

    // Write the updated data back to the JSON file
    fs.writeFileSync(hotelPath, JSON.stringify(updatedData, null, 2));

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ message: 'Error updating hotel data' });
  }
};


// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// POST /api/hotel/:hotelId/images - Upload images
export const uploadHotelImages = [
  upload.array('images'),
  async (req: Request, res: Response) => {
    try {
      const { hotelId } = req.params;
      const uploadedFiles = req.files as Express.Multer.File[];

      // Check if images were uploaded
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
      }

      // Generate image paths
      const imagePaths = uploadedFiles.map(file => `/uploads/${file.filename}`);

      // Path to the hotel JSON file
      const hotelPath = path.join(dataDir, `${hotelId}.json`);

      // Check if the hotel record exists
      if (!fs.existsSync(hotelPath)) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Read the current hotel data
      const hotelData = JSON.parse(fs.readFileSync(hotelPath, 'utf-8'));

      // Add images to the hotel's `images` array, or create it if it doesn't exist
      hotelData.images = hotelData.images ? hotelData.images.concat(imagePaths) : imagePaths;

      // Write the updated hotel data back to the JSON file
      fs.writeFileSync(hotelPath, JSON.stringify(hotelData, null, 2));

      // Respond with success and the new image paths
      return res.status(200).json({ message: 'Images uploaded successfully', images: imagePaths });
    } catch (error) {
      console.error('Error uploading images:', error);
      return res.status(500).json({ message: 'Failed to upload images', error });
    }
  }
];
