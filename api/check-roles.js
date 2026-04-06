require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
mongoose.connect('mongodb+srv://jackira01:Wrdnvhj9RpUY0W@cluster0.l620ugm.mongodb.net/?appName=Cluster0')
  .then(async () => {
    const users = await User.find({}).select('role firstname lastname').limit(20);
    console.log(JSON.stringify(users.map(u => ({ id: u._id, role: u.role, name: u.firstname }))));
    mongoose.disconnect();
  });
