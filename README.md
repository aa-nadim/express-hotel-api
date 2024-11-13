# Hotel Details REST API

This project provides REST APIs for serving hotel details using Node.js, Express.js and TypeScript.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder_structure)
- [Request](#request)

## Features

- Serve hotel details from JSON file.
- Robust error handling to prevent app crashes
- Proper HTTP status codes and response/error messages

## Prerequisites

- Node.js (v14.x or later)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/aa-nadim/express-hotel-api.git
    cd express-hotel-api.git
    ```

2. Install dependencies:
    ```bash
    npm i
    ```
## Usage 
```
npm run dev 
```

## API Endpoints
```
Get all hotels

    URL: /api/hotels
    Method: GET
    Description: Retrieve a list of all hotels.

Get all images

    URL: /api/images
    Method: GET
    Description: Retrieve a list of all images.

Get all rooms

    URL: /api/rooms
    Method: GET
    Description: Retrieve a list of all rooms.
```

## Folder Structure
```
express-hotel-api.git/
├── src/
│   ├── config/
│   │   └── config.ts
│   ├── controllers/
│   │   ├── hotelController.ts
│   │   ├── imageController.ts
│   │   └── roomController.ts
│   ├── interfaces/
│   │   └── hotelInterface.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── uploadMiddleware.ts
│   ├── models/
│   │   └── roomModel.ts
│   ├── routes/
│   │   ├── hotelRoutes.ts
│   │   ├── imageRoutes.ts
│   │   └── roomRoutes.ts
│   ├── services/
│   │   ├── hotelService.ts
│   │   ├── imageService.ts
│   │   └── roomService.ts
│   ├── utils/
│   │   ├── database.ts
│   │   └── validation.ts
│   └── app.ts
├── tests/
│   └── hotel.test.ts
├── uploads/
│   └── 
├── .env
├── .eslintrc.json
├── .gitignore
├── jest.config.js
├── package.json
└── tsconfig.json
```

## Request

1. GET /hotels: get all hotels
```
curl -X GET http://localhost:3000/api/hotels
```

2. GET /images: get all images
```
curl -X GET http://localhost:3000/api/images
```

3. GET /rooms: get all rooms
```
curl -X GET http://localhost:3000/api/rooms
```

4. GET /hotel/{hotel-id}:
```
curl -X GET http://localhost:3000/api/hotel/[hotel-id]
```

5. POST /hotel:
```
curl -X POST http://localhost:3000/api/hotel \
-H "Content-Type: application/json" \
-d '{
  "title": "Luxury Suite Hotel",
  "description": "A beautiful luxury hotel",
  "guestCount": 4,
  "bedroomCount": 2,
  "bathroomCount": 2,
  "amenities": ["wifi", "pool"],
  "host": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}'

```

6. POST /images:
```
curl -X POST http://localhost:3000/api/hotel/[hotel-id]/images \
-F "images=@/yourImagePath/image.jpg" \
-F "images=@/yourImagePath/image.png"
```


7. PUT /hotel/{hotel-id}:
```
curl -X PUT http://localhost:3000/api/hotel/[hotel-id] \
-H "Content-Type: application/json" \
-d '{
  "title": "Updated Hotel Name"
}'


curl -X PUT http://localhost:3000/api/hotel/[hotel-id] \
-H "Content-Type: application/json" \
-d '{
   "rooms": [
    {
      "hotelSlug": "dhaka-hotel-5star",
      "roomSlug": "luxury-suite",
      "roomImage": "/uploads/1731392952626-577730834.png",
      "roomTitle": "Luxury Suite",
      "bedroomCount": 1
    },
    {
      "hotelSlug": "dhaka-hotel-5star",
      "roomSlug": "executive-suite",
      "roomImage": "/uploads/1731392952638-468673036.png",
      "roomTitle": "Executive Suite",
      "bedroomCount": 2
    },
    {
      "hotelSlug": "dhaka-hotel-5star",
      "roomSlug": "family-suite",
      "roomImage": "/uploads/1731395511734-205512735.png",
      "roomTitle": "Family Suite",
      "bedroomCount": 2
    },
    {
      "hotelSlug": "dhaka-hotel-5star",
      "roomSlug": "presidential-suite",
      "roomImage": "/uploads/1731395511737-106499270.png",
      "roomTitle": "Presidential Suite",
      "bedroomCount": 3
    }
  ]
}'

```



