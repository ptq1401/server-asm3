const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//-------create Schema product------
const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  img1: { type: String, required: true },
  img2: { type: String, required: true },
  img3: { type: String, required: true },
  img4: { type: String, required: true },
  img5: { type: String, required: true },
  long_desc: { type: String, required: true },
  short_desc: { type: String, required: true },
  quantity: { type: Number, required: true },
});

//--------exports model-------------
module.exports = mongoose.model("Product", productSchema);
