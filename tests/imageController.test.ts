import request from 'supertest';
import path from 'path';
import fs from 'fs/promises';
import { app } from '../src/app'; 
import { setupTestEnvironment, cleanupTestEnvironment } from './setup'; 
import config from '../src/config/config'; 

describe('Image Controller', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  afterAll(async () => {
    await cleanupTestEnvironment();
  });

  describe('GET /api/images', () => {
    it('should return list of all uploaded images', async () => {
      // Create test images
      const testImages = ['test1.jpg', 'test2.jpg'];
      await Promise.all(
        testImages.map(image => 
          fs.writeFile(
            path.join(config.uploadDir, image),
            'fake image content'
          )
        )
      );

      const response = await request(app)
        .get('/api/images')
        .expect(200);

      expect(response.body.images).toHaveLength(2);
      expect(response.body.images).toEqual(
        expect.arrayContaining([
          '/uploads/test1.jpg',
          '/uploads/test2.jpg'
        ])
      );

      // Cleanup
      await Promise.all(
        testImages.map(image =>
          fs.unlink(path.join(config.uploadDir, image))
        )
      );
    });

    it('should return empty array when no images exist', async () => {
      const response = await request(app)
        .get('/api/images')
        .expect(200);

      expect(response.body.images).toEqual([]);
    });
  });
});