const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const { check, body } = require("express-validator");

//---------------------------------------------
//--sign up--
const checkSignUpForm = [
  body("email", "Email cannot be empty.").notEmpty(),
  body("password", "Password cannot be empty.").notEmpty(),
  body("fullName", "Your name cannot be empty.").notEmpty(),
  body("confirmPassword", "Confirm Password cannot be empty.").notEmpty(),
  check("email").isEmail().withMessage("Please enter a valid email."),
  check("password")
    .isLength({
      min: 8,
    })
    .withMessage("Password must at least 8 characters."),
];
router.post("/signup", checkSignUpForm, userController.postSignUp);

//--login--
const checkLoginForm = [
  body("email", "Email cannot be empty.").notEmpty(),
  body("password", "Password cannot be empty.").notEmpty(),
  check("email").isEmail().withMessage("Please enter a valid email."),
];
router.post("/login", checkLoginForm, userController.postLogin);
router.post("/login-admin", checkLoginForm, userController.postLoginAdmin);
//-----
router.get("/logout", userController.getLogout);
router.post("/check-login", userController.getCheckLogin);
//---------------------------------------------
module.exports = router;
