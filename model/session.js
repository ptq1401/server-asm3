const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//-------create Schema order------
const sessionSchema = new Schema({
  user_id: { type: String, required: true },
  message: [{ msg: { type: String }, user: { type: Boolean }, _id: false }],
});

//--------exports model-------------
module.exports = mongoose.model("Session", sessionSchema);
