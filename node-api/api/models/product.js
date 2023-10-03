const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const ProductSchema = mongoose.Schema(
  {
    product: {
      type: String,
      default: "",
    },
    discount_band: {
      type: String,
      // required: true,
      default: "",
    },
    units_sold: {
      type: String,
      default: "",
    },
    manufacturing_price: {
      type: String,
      default: "",
    },
    sale_price: {
      type: String,
      default: "",
    },
    gross_sales: {
      type: String,
      default: "",
    },
    discounts: {
      type: String,
      default: "",
    },
    sales: {
      type: String,
      default: "",
    },
    COGS: {
      type: String,
      default: "",
    },
    profit: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
ProductSchema.plugin(aggregatePaginate);
ProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("product", ProductSchema);
