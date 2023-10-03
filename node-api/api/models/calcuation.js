const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const calculationSchema = mongoose.Schema(
  {
    marketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Market",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "episode",
    },
    year: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
    month_number: {
      type: Number,
      default: 0,
    },
    month_name: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
calculationSchema.plugin(aggregatePaginate);
calculationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Calculation", calculationSchema);
