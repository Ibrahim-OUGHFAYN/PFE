const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function addAdminToAtlas() {
  try{
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = 'admin@example.com';
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      return;
    }

    const hashedPassword = await bcrypt.hash('12345', 10);

    const admin = new User({
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: 'admin',
      imgUrl: '/assets/defaultUserImage.jpg'
    });

    await admin.save();
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

addAdminToAtlas();
