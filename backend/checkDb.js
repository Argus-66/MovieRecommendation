import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file manually
const envPath = join(dirname(__dirname), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Apply the environment variables
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}

async function checkDbStructure() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Get a list of all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // For each collection, get a sample document to understand its structure
    for (const collection of collections) {
      const collectionName = collection.name;
      const sampleDoc = await mongoose.connection.db.collection(collectionName).findOne({});
      
      console.log(`\nSample document from ${collectionName}:`);
      console.log(JSON.stringify(sampleDoc, null, 2));
    }

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (err) {
    console.error('Error checking database structure:', err);
  }
}

checkDbStructure(); 