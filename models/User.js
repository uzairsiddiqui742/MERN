const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
   username:{
      type: String,
   },
   email: {
      type: String,
      required: true,
   },
   password: {
      type: String,
      required: true
   }
},{
   collection: 'users'
})
const User = mongoose.model('User', userSchema);
module.exports = User;