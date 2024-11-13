// tests/imageController.test.ts
import request from 'supertest';
import path from 'path';
import fs from 'fs/promises';
import { app } from '../src/app'; 
import config from '../src/config/config';

describe('Image Controller', () => {
  const testImages = ['test1.jpg', 'test2.jpg'];
  const uploadDir = config.uploadDir;

  // Helper function to add test images
  const createTestImages = async () => {
    await Promise.all(
      testImages.map(image => 
        fs.writeFile(
          path.join(uploadDir, image),
          'fake image content'  // Mock image data
        )
      )
    );
  };

  // Helper function to clear all images from the upload directory
  const clearUploadDir = async () => {
    try {
      const files = await fs.readdir(uploadDir);
      await Promise.all(files.map(file => fs.unlink(path.join(uploadDir, file))));
    } catch (error) {
      // Type assertion to specify error type as NodeJS.ErrnoException
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;  // Rethrow if it's not an 'ENOENT' error
      }
    }
  };

  beforeAll(async () => {
    // Create the upload directory if it doesn't exist
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory: ${error}`);
    }
    // Clear upload directory before all tests
    await clearUploadDir();
  });

  afterAll(async () => {
    // Final cleanup after all tests
    await clearUploadDir();
  });

  describe('GET /api/images', () => {
    afterEach(async () => {
      // Ensure directory is clear after each test
      await clearUploadDir();
    });

    it('should return list of all uploaded images', async () => {
      // Create test images for this test
      await createTestImages();

      const response = await request(app)
        .get('/api/images')
        .expect(200);

      // Assert that the response has the expected images
      expect(response.body.images).toHaveLength(2);
      expect(response.body.images).toEqual(
        expect.arrayContaining([
          '/uploads/test1.jpg',
          '/uploads/test2.jpg'
        ])
      );
    });

    it('should return empty array when no images exist', async () => {
      const response = await request(app)
        .get('/api/images')
        .expect(200);

      // Assert that the response is an empty array when no images are present
      expect(response.body.images).toEqual([]);
    });
  });
});
