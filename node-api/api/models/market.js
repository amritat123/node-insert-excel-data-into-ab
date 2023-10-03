const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const MarketSchema = mongoose.Schema(
  {
    country: {
      type: String,
      default: "",
    },
    segment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
MarketSchema.plugin(aggregatePaginate);
MarketSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Market", MarketSchema);
