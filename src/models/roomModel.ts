//// src/models/roomModel.ts

export interface Room {
  id: string;
  title: string;
  capacity: number;
  price: number;
  amenities: string[];
}

const rooms: Room[] = [];  // Sample in-memory storage for rooms

export const getRooms = (): Room[] => {
  return rooms;
};
  