const { MongoClient } = require('mongodb');
// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'event';
async function connectDB() {
  await client.connect(dbName);
  console.log('Connected successfully to server');
}

module.exports={
  connectDB,client
}
