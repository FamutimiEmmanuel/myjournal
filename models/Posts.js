 const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
   
    posts:[
        {
          title:{
            type: String
          },
          post:{
            type: String
          }
        }
      ],
   
});

module.exports = mongoose.model('post', PostSchema);