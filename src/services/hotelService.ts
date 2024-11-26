// src/services/hotelService.ts
import { Hotel } from '../interfaces/hotelInterface';
import slugify from 'slugify';
import path from 'path';
import fs from 'fs/promises';
import config from '../config/config';

export class HotelService {
  private dataFile: string;

  constructor() {
    this.dataFile = config.dataFile;
    this.initializeDataFile();
  }

  private async initializeDataFile() {
    try {
      await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
      try {
        await fs.access(this.dataFile);
      } catch {
        await fs.writeFile(this.dataFile, JSON.stringify({ hotels: {} }, null, 2));
      }
    } catch (error) {
      console.error('Failed to initialize data file:', error);
      throw new Error('Failed to initialize data storage');
    }
  }

  private async readData(): Promise<{ hotels: Record<string, Hotel> }> {
    try {
      const data = await fs.readFile(this.dataFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading data file:', error);
      return { hotels: {} };
    }
  }

  private async writeData(data: { hotels: Record<string, Hotel> }): Promise<void> {
    await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2));
  }

  async createHotel(hotelData: Partial<Hotel>): Promise<Hotel> {
    // Validate required fields
    if (!hotelData.title) {
      throw new Error('Hotel title is required');
    }

    const data = await this.readData();
    
    const hotel: Hotel = {
      id: Date.now().toString(),
      title: hotelData.title,
      description: hotelData.description || '',
      slug: slugify(hotelData.title, { lower: true }),
      images: hotelData.images || [],
      rooms: hotelData.rooms || [],
      guestCount: hotelData.guestCount || 0,
      bedroomCount: hotelData.bedroomCount || 0,
      bathroomCount: hotelData.bathroomCount || 0,
      amenities: hotelData.amenities || [],
      host: hotelData.host || { name: '' },
      address: hotelData.address || { 
        street: '', 
        city: '', 
        country: '', 
        zipCode: '' 
      },
      location: hotelData.location || { 
        latitude: 0, 
        longitude: 0 
      },
      price: hotelData.price || 0
    };

    data.hotels[hotel.id] = hotel;
    await this.writeData(data);
    return hotel;
  }

  async updateHotel(hotelId: string, updates: Partial<Hotel>): Promise<Hotel> {
    const data = await this.readData();
    
    if (!data.hotels[hotelId]) {
      throw new Error('Hotel not found');
    }

    const existingHotel = data.hotels[hotelId];

    const updatedHotel: Hotel = {
      ...existingHotel,
      ...updates,
      slug: updates.title 
        ? slugify(updates.title, { lower: true }) 
        : existingHotel.slug,
      images: updates.images 
        ? [...(existingHotel.images || []), ...(updates.images || [])]
        : existingHotel.images,
      rooms: updates.rooms 
        ? [...(existingHotel.rooms || []), ...(updates.rooms || [])]
        : existingHotel.rooms
    };

    data.hotels[hotelId] = updatedHotel;
    await this.writeData(data);
    return updatedHotel;
  }

  async getHotel(hotelId: string): Promise<Hotel> {
    const data = await this.readData();
    const hotel = data.hotels[hotelId];
    
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    return hotel;
  }

  async getAllHotels(): Promise<Hotel[]> {
    const data = await this.readData();
    return Object.values(data.hotels);
  }

  async updateHotelImages(hotelId: string, imageUrls: string[]): Promise<Hotel> {
    const data = await this.readData();
    
    if (!data.hotels[hotelId]) {
      throw new Error('Hotel not found');
    }

    data.hotels[hotelId].images = [
      ...(data.hotels[hotelId].images || []),
      ...imageUrls
    ];

    await this.writeData(data);
    return data.hotels[hotelId];
  }
}