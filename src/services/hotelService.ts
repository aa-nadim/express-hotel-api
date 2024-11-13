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
    const data = await fs.readFile(this.dataFile, 'utf-8');
    return JSON.parse(data);
  }

  private async writeData(data: { hotels: Record<string, Hotel> }): Promise<void> {
    await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2));
  }

  async createHotel(hotelData: Partial<Hotel>): Promise<Hotel> {
    const data = await this.readData();
    
    const hotel: Hotel = {
      ...hotelData as Hotel,
      id: Date.now().toString(),
      slug: slugify(hotelData.title || '', { lower: true }),
      images: hotelData.images || [],
      rooms: hotelData.rooms || []
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

    const updatedHotel = {
      ...data.hotels[hotelId],
      ...updates,
      slug: updates.title ? slugify(updates.title, { lower: true }) : data.hotels[hotelId].slug
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
      ...data.hotels[hotelId].images,
      ...imageUrls
    ];

    await this.writeData(data);
    return data.hotels[hotelId];
  }
}