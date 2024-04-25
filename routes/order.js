const express = require("express");
const router = express.Router();
const { body, check } = require("express-validator");
const orderController = require("../controller/order");
const { adminAuthentication } = require("../middleware/auth");
//---------------------------------------------
//--add product to cart--
router.post("/add-to-cart", orderController.postAddToCart);

router.get("/get-cart", orderController.getCart);

router.post("/remove-product", orderController.postRemoveProduct);

router.get("/get-order", orderController.getOrder);

router.get("/get-all-order", adminAuthentication, orderController.getAllOrder);
//--order---
const checkForm = [
  body("email", "Email cannot be empty.").notEmpty(),
  body("phoneNumber", "PhoneNumber cannot be empty.").notEmpty(),
  body("name", "Your name cannot be empty.").notEmpty(),
  body("address", "Address cannot be empty.").notEmpty(),
  check("email").isEmail().withMessage("Please enter a valid email."),
];
router.post("/order", checkForm, orderController.postOrder);
router.post("/detail-order", orderController.postDetailOrder);
//---------------------------------------------
module.exports = router;
