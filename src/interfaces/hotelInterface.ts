// src/interfaces/hotelInterface.ts
export interface Room {
  hotelSlug: string;
  roomSlug: string;
  roomImage: string;
  roomTitle: string;
  bedroomCount: number;
}
  
export interface Hotel {
  id: string;
  slug: string;
  images: string[];
  title: string;
  description: string;
  guestCount: number;
  bedroomCount: number;
  bathroomCount: number;
  amenities: string[];
  host: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  rooms: Room[];
}