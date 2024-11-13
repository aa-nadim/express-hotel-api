// tests/hotel.test.ts
import request from 'supertest';
import app from '../src/app';
import { HotelService } from '../src/services/hotelService';
import fs from 'fs/promises';
import path from 'path';

jest.mock('../src/services/hotelService');

describe('Hotel API', () => {
  const mockHotel = {
    id: '1',
    slug: 'test-hotel',
    title: 'Test Hotel',
    description: 'A test hotel',
    guestCount: 2,
    bedroomCount: 1,
    bathroomCount: 1,
    amenities: ['wifi'],
    host: {
      name: 'John
    }
  }
}