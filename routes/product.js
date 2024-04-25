const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const productController = require("../controller/product");
const { adminAuthentication } = require("../middleware/auth");
//---------------------------------------------
//--add product--
const checkProductForm = [
  body("name", "Name cannot be empty.").notEmpty(),
  body("category", "Category cannot be empty.").notEmpty(),
  body("long_desc", "Long description cannot be empty.").notEmpty(),
  body("short_desc", "Short description cannot be empty.").notEmpty(),
  body("price", "Price cannot be empty.").notEmpty(),
];
router.post(
  "/add-product",
  adminAuthentication,
  checkProductForm,
  productController.postAddProduct
);
router.post("/delete-product", productController.postDeleteProduct);
router.post(
  "/update-product",
  checkProductForm,
  productController.postUpdateProduct
);
router.get("/product-trending", productController.getProductTrending);
router.get("/get-product", productController.getAllProduct);
router.get(
  "/get-product-admin",
  adminAuthentication,
  productController.getAllProduct
);
router.post("/get-detail", productController.getDetailProduct);
//---------------------------------------------
module.exports = router;
