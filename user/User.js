var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: Number,
  famille: String,
  race: String,
  nourriture: String,
  freinds: [{name: String}]
});
mongoose.model("User", UserSchema);

module.exports = mongoose.model("User");
