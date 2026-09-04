const mongoose = require('mongoose');

// Testing with potential @ in password
const testUri = 'mongodb+srv://Rishi:Rrishi%401508@cluster0.imsxkfd.mongodb.net/?appName=Cluster0';

const checkConnection = async () => {
  try {
    console.log('Connecting to MongoDB with potential fix...');
    await mongoose.connect(testUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    console.log('✅ MongoDB Connection Successful with @!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed with @:');
    console.log(error.message);
    process.exit(1);
  }
};

checkConnection();
