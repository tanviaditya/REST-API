const mongoose = require("mongoose");

const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency; //new currency type is added in mongoose of which we can make use later

const promoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    details: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    price: {
      type: Currency,
      required: true,
      min: 0,
    },
    featured: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

var Promotions = mongoose.model("Promotion", promoSchema);

module.exports = Promotions;
