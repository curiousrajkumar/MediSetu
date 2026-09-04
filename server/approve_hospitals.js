const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Hospital = require('./models/Hospital');

async function approveAll() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await Hospital.updateMany({ status: 'pending' }, { $set: { status: 'approved' } });
    console.log(`Approved ${result.modifiedCount} pending hospitals`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

approveAll();
