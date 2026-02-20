const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set');
}
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('jewel-flow-boutique'); // Replace with your database name
    console.log('Connected to MongoDB Atlas');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

module.exports = { connectToDatabase, getDb };
