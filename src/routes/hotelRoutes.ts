// src/routes/hotelRoutes.ts
import express from 'express';
import { getAllHotels, getHotelById, createHotel, updateHotel, uploadHotelImages } from '../controllers/hotelController';

const router = express.Router();

// Routes
router.get('/hotels', getAllHotels);
router.get('/hotel/:hotelId', getHotelById);
router.post('/hotel', createHotel);
router.post('/hotel/:hotelId/images', uploadHotelImages);
router.put('/hotel/:hotelId', updateHotel);

export default router;
