// src/routes/roomRoutes.ts
import express from 'express';
import { getAllRooms } from '../controllers/roomController';

const router = express.Router();

// GET /api/rooms - List all rooms from JSON files
router.get('/rooms', getAllRooms);

export default router;


