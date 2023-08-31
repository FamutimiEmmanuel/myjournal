const mongoose = require('mongoose');

const WriterSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    writerid: {
        type: String,
        required: true,
        unique: true
      },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    picture: {
      type: String
    },
    resetToken:String,
    expireToken:Date,
   
});

module.exports = mongoose.model('writer', WriterSchema);