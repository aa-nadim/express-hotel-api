// src/routes/imageRoutes.ts

import express from 'express';
import { listImages } from '../controllers/imageController';

const router = express.Router();

// GET /api/images - List all uploaded images
router.get('/images', listImages);

export default router;

