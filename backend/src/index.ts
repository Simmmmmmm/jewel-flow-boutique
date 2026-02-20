import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import addressRoutes from './routes/address';
import orderRoutes from './routes/order';
import { connectDB } from './database';

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}
connectDB(mongoUri);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Jewel Flow Backend API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
