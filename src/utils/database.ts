// src/utils/database.ts
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'data.json');

export class Database {
  private static instance: Database;
  private data: { hotels: Record<string, any> } = { hotels: {} };

  private constructor() {}

  static async getInstance(): Promise<Database> {
    if (!Database.instance) {
      Database.instance = new Database();
      await Database.instance.init();
    }
    return Database.instance;
  }

  private async init(): Promise<void> {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(DATA_FILE);
      await fs.mkdir(dataDir, { recursive: true });

      // Try to read existing data file
      try {
        const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } catch (error) {
        // If file doesn't exist, create it with empty hotels object
        await this.saveData();
      }
    } catch (error) {
      throw new Error('Failed to initialize database');
    }
  }

  private async saveData(): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(this.data, null, 2));
  }

  async getAllHotels(): Promise<any[]> {
    return Object.values(this.data.hotels);
  }

  async getHotel(id: string): Promise<any> {
    const hotel = this.data.hotels[id];
    if (!hotel) {
      throw new Error('Hotel not found');
    }
    return hotel;
  }

  async createHotel(hotel: any): Promise<any> {
    this.data.hotels[hotel.id] = hotel;
    await this.saveData();
    return hotel;
  }

  async updateHotel(id: string, updates: any): Promise<any> {
    if (!this.data.hotels[id]) {
      throw new Error('Hotel not found');
    }
    this.data.hotels[id] = { ...this.data.hotels[id], ...updates };
    await this.saveData();
    return this.data.hotels[id];
  }

  async deleteHotel(id: string): Promise<void> {
    if (!this.data.hotels[id]) {
      throw new Error('Hotel not found');
    }
    delete this.data.hotels[id];
    await this.saveData();
  }
}