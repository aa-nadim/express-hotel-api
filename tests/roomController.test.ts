// tests/roomController.test.ts

import request from 'supertest';
import path from 'path';
import { app } from '../src/app'; 
import { setupTestEnvironment, cleanupTestEnvironment, createTestFile } from './setup';

describe('Room Controller', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  afterAll(async () => {
    await cleanupTestEnvironment();
  });

  beforeEach(async () => {
    // Clear any test files before each test to ensure a fresh start
    await cleanupTestEnvironment();
    await setupTestEnvironment();
  });

  describe('GET /api/rooms', () => {
    it('should return all rooms from all hotels', async () => {
      const testHotels = [
        {
          id: 'hotel1',
          rooms: [
            {
              hotelSlug: 'hotel-1',
              roomSlug: 'room-1',
              roomTitle: 'Room 1',
              bedroomCount: 2
            }
          ]
        },
        {
          id: 'hotel2',
          rooms: [
            {
              hotelSlug: 'hotel-2',
              roomSlug: 'room-2',
              roomTitle: 'Room 2',
              bedroomCount: 1
            }
          ]
        }
      ];

      await Promise.all(
        testHotels.map(hotel => 
          createTestFile(`${hotel.id}.json`, hotel)
        )
      );

      const response = await request(app)
        .get('/api/rooms')
        .expect(200);

      expect(response.body.rooms).toHaveLength(2);
      expect(response.body.rooms[0].roomTitle).toBe('Room 1');
      expect(response.body.rooms[1].roomTitle).toBe('Room 2');
    });

    it('should return empty array when no rooms exist', async () => {
      const response = await request(app)
        .get('/api/rooms')
        .expect(200);

      expect(response.body.rooms).toEqual([]);
    });
  });
});
