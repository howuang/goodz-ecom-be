const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./Review")

const productSchema = Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    rating: { type: Number, required: true, default: 0 },
    reviews: [Review]
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
