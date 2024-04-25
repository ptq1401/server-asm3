const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//-------create Schema user------
const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

//--------exports model-------------
module.exports = mongoose.model("User", userSchema);
