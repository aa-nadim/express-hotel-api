// src/utils/validation.ts
import Joi from 'joi';
import { Hotel, Room } from '../interfaces/hotelInterface';

// Create two schemas - one for creation and one for updates
const roomSchema = Joi.object({
  hotelSlug: Joi.string(),
  roomSlug: Joi.string(),
  roomImage: Joi.string(),
  roomTitle: Joi.string().required(),
  bedroomCount: Joi.number().required().min(1)
});

const updateRoomSchema = roomSchema.fork(
  Object.keys(roomSchema.describe().keys),
  (schema) => schema.optional()
);

// Base hotel schema for creation
const hotelSchema = Joi.object({
  id: Joi.string(),
  slug: Joi.string(),
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  guestCount: Joi.number().min(1).required(),
  bedroomCount: Joi.number().min(1).required(),
  bathroomCount: Joi.number().min(1).required(),
  amenities: Joi.array().items(Joi.string()).min(1).required(),
  host: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[\d\s-]+$/).required()
  }).required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zipCode: Joi.string().required()
  }).required(),
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
  }).required(),
  images: Joi.array().items(Joi.string()),
  rooms: Joi.array().items(roomSchema)
});

// Create update schema where all fields are optional
const updateHotelSchema = hotelSchema.fork(
  Object.keys(hotelSchema.describe().keys),
  (schema) => schema.optional()
);

export class ValidationService {
  static validateHotel(data: Partial<Hotel>, isUpdate = false): Partial<Hotel> {
    const schemaToUse = isUpdate ? updateHotelSchema : hotelSchema;
    const { error, value } = schemaToUse.validate(data, { 
      stripUnknown: true,
      allowUnknown: true 
    });

    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }

    return value;
  }

  static validateRoom(data: Partial<Room>, isUpdate = false): Partial<Room> {
    const schemaToUse = isUpdate ? updateRoomSchema : roomSchema;
    const { error, value } = schemaToUse.validate(data, { 
      stripUnknown: true,
      allowUnknown: true 
    });

    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }

    return value;
  }
}
