const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['voyageur', 'guide', 'admin'],
    default: 'voyageur',
  },
  experience: {
    type: Number,
    required: function () {
      return this.role === 'guide';
    },
  },
  imgUrl:{type:String,null:true,default: '/assets/defaultUserImage.jpg'}
});

module.exports = mongoose.model('User', userSchema);
