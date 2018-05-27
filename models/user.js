var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,

  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('user', userSchema);
