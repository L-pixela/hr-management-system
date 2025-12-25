const router = require("express").Router();
const controller = require("../controllers/authController");
const validate = require("../middlewares/validateMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerValidation,
  loginValidation
} = require("../validations/authValidation");

router.post(
  "/register",
  registerValidation,
  validate,
  controller.register
);

router.post(
  "/login",
  loginValidation,
  validate,
  controller.login
);

// Returns basic user info from token
router.get("/me", authMiddleware, controller.me);

// Token introspection (accepts { token })
router.post("/introspect", controller.introspect);

module.exports = router;
