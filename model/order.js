const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//-------create Schema order------
const orderSchema = new Schema({
  user_id: { type: String, required: true },
  cart: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      _id: false,
    },
  ],
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  address: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  total: { type: Number, default: 0 },
  status: { type: String, default: "Waiting for pay" },
});

//--------exports model-------------
module.exports = mongoose.model("Order", orderSchema);
