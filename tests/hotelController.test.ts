import request from 'supertest';
import path from 'path';
import fs from 'fs/promises';
import { app } from '../src/app';
import { setupTestEnvironment, cleanupTestEnvironment, createTestFile } from './setup';
import config from '../src/config/config';

describe('Hotel Controller', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  afterAll(async () => {
    await cleanupTestEnvironment();
  });

  afterEach(async () => {
    // Clean up data directory between tests
    const files = await fs.readdir(config.dataDir);
    await Promise.all(
      files.map(file => fs.unlink(path.join(config.dataDir, file)))
    );
  });

  describe('POST /api/hotel', () => {
    const validHotelData = {
      title: 'Test Hotel',
      description: 'A beautiful test hotel',
      guestCount: 4,
      bedroomCount: 2,
      bathroomCount: 2,
      amenities: ['wifi', 'parking', 'pool'],
      host: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      },
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zipCode: '12345'
      },
      location: {
        latitude: 40.7128,
        longitude: -74.0060
      }
    };

    it('should create a new hotel with valid data', async () => {
      const response = await request(app)
        .post('/api/hotel')
        .send(validHotelData)
        .expect(201);

      expect(response.body).toHaveProperty('hotelId');
      expect(response.body.title).toBe(validHotelData.title);
    });

    it('should return 400 for invalid hotel data', async () => {
      const invalidData = { title: 'Test' }; // Missing required fields

      await request(app)
        .post('/api/hotel')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /api/hotels', () => {
    it('should return all hotels', async () => {
      const testHotels = [
        { id: '1', title: 'Hotel A' },
        { id: '2', title: 'Hotel B' }
      ];

      await Promise.all(
        testHotels.map(hotel => 
          createTestFile(`${hotel.id}.json`, hotel)
        )
      );

      const response = await request(app)
        .get('/api/hotels')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.map((h: any) => h.title))
        .toEqual(expect.arrayContaining(['Hotel A', 'Hotel B']));
    });

    it('should return empty array when no hotels exist', async () => {
      const response = await request(app)
        .get('/api/hotels')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/hotel/:hotelId', () => {
    it('should return specific hotel by ID', async () => {
      const testHotel = { id: 'test-id', title: 'Test Hotel' };

      await createTestFile('test-id.json', testHotel);

      const response = await request(app)
        .get('/api/hotel/test-id')
        .expect(200);

      expect(response.body.title).toBe(testHotel.title);
    });

    it('should return 404 for non-existent hotel', async () => {
      await request(app)
        .get('/api/hotel/non-existent')
        .expect(404);
    });
  });

  describe('PUT /api/hotel/:hotelId', () => {
    it('should update existing hotel', async () => {
      const testHotel = { id: 'test-id', title: 'Original Title' };
      await createTestFile('test-id.json', testHotel);

      const updates = { title: 'Updated Title' };
      const response = await request(app)
        .put('/api/hotel/test-id')
        .send(updates)
        .expect(200);

      expect(response.body.title).toBe(updates.title);
    });

    it('should return 404 for updating non-existent hotel', async () => {
      await request(app)
        .put('/api/hotel/non-existent')
        .send({ title: 'New Title' })
        .expect(404);
    });
  });

  describe('POST /api/hotel/:hotelId/images', () => {
    it('should upload hotel images', async () => {
      const testHotel = { id: 'test-id', title: 'Test Hotel', images: [] };
      await createTestFile('test-id.json', testHotel);

      const testImagePath = path.join(__dirname, '../uploads/test-image.jpg');
      await fs.writeFile(testImagePath, 'fake image content');

      const response = await request(app)
        .post('/api/hotel/test-id/images')
        .attach('images', testImagePath)
        .expect(200);

      expect(response.body.message).toBe('Images uploaded successfully');
      expect(response.body.images).toHaveLength(1);

      await fs.unlink(testImagePath); // Cleanup
    });

    it('should return 404 for uploading to non-existent hotel', async () => {
      const testImagePath = path.join(__dirname, '../uploads/test-image.jpg');
      await fs.writeFile(testImagePath, 'fake image content');

      await request(app)
        .post('/api/hotel/non-existent/images')
        .attach('images', testImagePath)
        .expect(404);

      await fs.unlink(testImagePath); // Cleanup
    });
  });
});
