const sendResponse = require("../helpers/sendResponse");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const productController = {};

productController.createProduct = async (req, res, next) => {
  console.log("to controller");
  const { name } = req.body;
  let { price, stock } = req.body;
  let result;
  try {
    if (!name || !price || !stock) {
      throw new Error("missing info when create product");
    }
    price = parseInt(price);
    stock = parseInt(stock);

    if (
      typeof price !== "number" ||
      price < 0 ||
      typeof stock !== "number" ||
      stock < 0
    ) {
      throw new Error("price or stock invalid");
    }

    const newProduct = {
      name,
      price,
      stock,
    };
    console.log("hahha", newProduct);

    const found = await Product.findOne({ name });
    if (found) {
      throw new Error("Duplicate product name");
    }

    result = await Product.create(newProduct);
  } catch (error) {
    return next(error);
  }

  return sendResponse(res, 200, true, result, false, "success");
};

productController.getAllProduct = async (req, res, next) => {
  let { limit, page, ...filter } = req.query;
  limit = parseInt(req.query.limit) || 5;
  page = parseInt(req.query.page) || 1;
  let count = 0;
  let result;
  try {
    result = await Product.find({ ...filter, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));

    count = result.length;
  } catch (error) {
    return next(error);
  }
  return sendResponse(
    res,
    200,
    true,
    { result, count },
    false,
    "Successfully get all product"
  );
};

productController.updateProduct = async (req, res, next) => {
  let result;
  const allowOptions = ["name", "stock", "price"];
  const updateObject = {};
  const { productId } = req.params;
  try {
    allowOptions.forEach((option) => {
      if (req.body[option] !== undefined) {
        updateObject[option] = req.body[option];
      }
    });
    if (!productId) throw new Error("product not found, or deleted");
    result = await Product.findByIdAndUpdate(productId, updateObject, {
      new: true,
    });
  } catch (error) {
    return next(error);
  }
  return sendResponse(
    res,
    200,
    true,
    result,
    false,
    "Successfully update product"
  );
};
productController.deleteProduct = async (req, res, next) => {
  let result;
  const { productId } = req.params;
  try {
    if (!productId) throw new Error("product not found, or deleted");
    result = await Product.findByIdAndUpdate(
      productId,
      { isDeleted: true },
      {
        new: true,
      }
    );
  } catch (error) {
    return next(error);
  }
  return sendResponse(
    res,
    200,
    true,
    null,
    false,
    "Successfully delete product"
  );
};
productController.getSingleProduct = async (req, res, next) => {
  let result;

  const { productId } = req.params;
  try {
    if (!productId) throw new Error("product not found, or deleted");
    result = await Product.findById(productId);
  } catch (error) {
    return next(error);
  }
  return sendResponse(
    res,
    200,
    true,
    result,
    false,
    "Successfully get single product"
  );
};

productController.addReview = async (req, res, next) => {
  let result;
  const { rating, comment } = req.body;
  console.log({rating, comment});
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId)
    if(!product) throw new Error("Product not found")
    if (product) {
      const alreadyReviewed = product.reviews.find((review) => 
        review.user.toString() ===req.user._id.toString()
      )
      if (alreadyReviewed){throw new Error("Product already reviewed")}
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.numReviews = product.views.length;
    product.rating = product.reviews.length((acc, item) => item.rating + acc, 0) / product.reviews.length;
    result = await product.findByIdAndUpdate(productId, review, {
      new: true,
    })
  } catch (error) {
    
  }
  return sendResponse(
    res,
    200,
    true,
    result,
    false,
    "Successfully add rating and review to product"
  );
}



module.exports = productController;
