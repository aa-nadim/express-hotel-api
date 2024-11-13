// src/services/roomService.ts

import fs from 'fs';
import path from 'path';

// Define the path to the JSON data file
const dataFilePath = path.join(__dirname, '../../data/data.json');

interface Room {
  hotelSlug: string;
  roomSlug: string;
  roomImage: string;
  roomTitle: string;
  bedroomCount: number;
}

interface HotelData {
  hotels: {
    [key: string]: {
      rooms: Room[];
    };
  };
}

// Function to load rooms from JSON file
export const loadRoomsFromFile = (): Room[] => {
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  const hotelData: HotelData = JSON.parse(data);

  // Collect all rooms from each hotel
  const allRooms: Room[] = [];
  Object.values(hotelData.hotels).forEach(hotel => {
    allRooms.push(...hotel.rooms);
  });

  return allRooms;
};

