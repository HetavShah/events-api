const { MongoClient } = require('mongodb');
// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function connectDB() {
  await client.connect();
}

module.exports={
  connectDB,client
}
