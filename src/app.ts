import express from 'express';
import path from 'path';
import hotelRoutes from './routes/hotelRoutes';
import imageRoutes from './routes/imageRoutes';
import roomRoutes from './routes/roomRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files route
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Hotel routes
app.use('/api', hotelRoutes);
app.use('/api', imageRoutes);
app.use('/api', roomRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
