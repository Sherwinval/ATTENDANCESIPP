import cors from 'cors';
import dns from 'node:dns';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import attendanceRoutes from './routes/attendance.js';
import participantRoutes from './routes/participants.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance-system';
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const mongoReconnectDelayMs = Number(process.env.MONGODB_RECONNECT_DELAY_MS || 5000);
const mongoDnsServers = process.env.MONGODB_DNS_SERVERS
  ?.split(',')
  .map((server) => server.trim())
  .filter(Boolean);
let mongoReconnectTimer = null;

function ensureDatabaseConnection(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database connection is not ready. Please wait a moment and try again.',
    });
  }

  return next();
}

function configureMongoDns(uri) {
  if (!uri.startsWith('mongodb+srv://')) {
    return;
  }

  const dnsServers =
    mongoDnsServers && mongoDnsServers.length > 0 ? mongoDnsServers : ['8.8.8.8', '1.1.1.1'];

  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(dnsServers);

  console.log(`Using DNS servers for MongoDB SRV lookup: ${dnsServers.join(', ')}`);
}

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', ensureDatabaseConnection, participantRoutes);
app.use('/api', ensureDatabaseConnection, attendanceRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ message: 'Invalid JSON request body.' });
  }

  console.error(error.stack || error);

  const message =
    process.env.NODE_ENV === 'production' ? 'Server error. Please try again.' : error.message;

  res.status(500).json({ message });
});

configureMongoDns(mongoUri);
mongoose.set('strictQuery', true);
mongoose.connection.on('disconnected', () => {
  console.error('MongoDB disconnected.');
  scheduleMongoReconnect();
});
mongoose.connection.on('error', (error) => {
  console.error('MongoDB runtime error:', error.message);
});

function scheduleMongoReconnect() {
  if (mongoReconnectTimer || mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  mongoReconnectTimer = setTimeout(() => {
    mongoReconnectTimer = null;
    void connectToMongo();
  }, mongoReconnectDelayMs);
}

async function connectToMongo() {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected.');
  } catch (error) {
    if (error.message.includes('querySrv')) {
      console.error(
        'MongoDB SRV lookup failed. Atlas IP allowlisting is not the problem here; the machine DNS resolver could not resolve the SRV record.'
      );
      console.error(
        'If this still fails, try setting MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1 in server/.env or switch to a direct non-SRV Atlas connection string from MongoDB Atlas.'
      );
    }

    console.error('MongoDB connection failed:', error.message);
    scheduleMongoReconnect();
  }
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

void connectToMongo();
