const express = require("express");
const {
  registrationController,
  loginController,
  registrationConfirmationController,
} = require("../controllers/authControllers");

const { asyncWrapper } = require("../helpers/apiHelpers");

const router = express.Router();

router.post("/registration", asyncWrapper(registrationController));
router.get(
  "/registration_confirmation/:code",
  asyncWrapper(registrationConfirmationController)
);
router.post("/login", asyncWrapper(loginController));

module.exports = router;
