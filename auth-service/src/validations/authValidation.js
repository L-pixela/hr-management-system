const { body } = require("express-validator");

exports.registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Email is invalid"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
];

exports.loginValidation = [
  body("email").isEmail(),
  body("password").notEmpty()
];
