const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkConnection = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connection Successful!');
    const dbName = mongoose.connection.name;
    console.log(`Connected to database: ${dbName}`);
    
    // List collections to verify access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(col => console.log(` - ${col.name}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.dir(error, { depth: null });
    process.exit(1);
  }
};

checkConnection();
