// src/controllers/hotelController.ts
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import config from '../config/config';
import { slugify } from '../utils/slug'; 

// Helper function to read hotel data safely
const readHotelData = (filePath: string) => {
  try {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    return null;
  }
};

// Helper function to validate hotel data based on test requirements
const isValidHotelData = (data: any) => {
  const requiredFields = [
    'title',
    'description',
    'guestCount',
    'bedroomCount',
    'bathroomCount',
    'amenities',
    'host',
    'address',
    'location'
  ];

  return requiredFields.every(field => data.hasOwnProperty(field)) &&
    Array.isArray(data.amenities) &&
    typeof data.host === 'object' &&
    typeof data.address === 'object' &&
    typeof data.location === 'object';
};


// At the top of your createHotel function, before writing the file
if (!fs.existsSync(config.dataDir)) {
  fs.mkdirSync(config.dataDir, { recursive: true });
}

// POST /api/hotel - Create a new hotel
export const createHotel = (req: Request, res: Response) => {
  const hotelData = req.body;

  // Validate the hotel data
  if (!isValidHotelData(hotelData)) {
    return res.status(400).json({ message: 'Invalid hotel data' });
  }

  // Generate a unique hotelId using UUID
  const hotelId = uuidv4();

  // Generate a slug from the hotel title
  const slug = slugify(hotelData.title);

  // Create the hotel object with the new slug
  const hotel = {
    hotelId,
    slug,
    ...hotelData, // Spread the rest of the hotel data
  };

  // Define the file name and file path to save the hotel data
  const fileName = `${hotelId}.json`;
  const filePath = path.join(config.dataDir, fileName);

  try {
    // Save the hotel data to a file
    fs.writeFileSync(filePath, JSON.stringify(hotel, null, 2));

    // Return the hotel object in the response
    res.status(201).json(hotel);
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ message: 'Failed to create hotel', error });
  }
};

// GET /api/hotels - Retrieve all hotels
export const getAllHotels = (req: Request, res: Response) => {
  try {
    const files = fs.readdirSync(config.dataDir);
    const hotels = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(config.dataDir, file);
        return readHotelData(filePath);
      })
      .filter(hotel => hotel !== null);
    
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve hotels', error });
  }
};

// GET /api/hotel/:hotelId - Retrieve a specific hotel
export const getHotelById = (req: Request, res: Response) => {
  const { hotelId } = req.params;
  const filePath = path.join(config.dataDir, `${hotelId}.json`);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const hotelData = readHotelData(filePath);
    if (!hotelData) {
      return res.status(500).json({ message: 'Failed to read hotel data' });
    }

    res.status(200).json(hotelData);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving hotel', error });
  }
};

// PUT /api/hotel/:hotelId - Update hotel
export const updateHotel = (req: Request, res: Response) => {
  const { hotelId } = req.params;
  const filePath = path.join(config.dataDir, `${hotelId}.json`);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const existingData = readHotelData(filePath);
    if (!existingData) {
      return res.status(500).json({ message: 'Failed to read existing hotel data' });
    }

    const updatedData = { ...existingData, ...req.body };
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ message: 'Error updating hotel', error });
  }
};

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });

// POST /api/hotel/:hotelId/images - Upload hotel images
export const uploadHotelImages = [
  upload.array('images'),
  async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const files = req.files as Express.Multer.File[];
    const filePath = path.join(config.dataDir, `${hotelId}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    try {
      const hotelData = readHotelData(filePath);
      if (!hotelData) {
        return res.status(500).json({ message: 'Failed to read hotel data' });
      }

      const imagePaths = files.map(file => `/uploads/${file.filename}`);
      hotelData.images = [...(hotelData.images || []), ...imagePaths];

      fs.writeFileSync(filePath, JSON.stringify(hotelData, null, 2));
      res.status(200).json({ 
        message: 'Images uploaded successfully', 
        images: imagePaths 
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to process image upload', error });
    }
  }
];