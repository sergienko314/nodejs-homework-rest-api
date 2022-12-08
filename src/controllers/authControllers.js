const {
  registrationUser,
  loginUser,
  registrationConfirmationUser,
} = require("../services/authService");

const registrationController = async (req, res) => {
  const { email, password } = req.body;
  await registrationUser(email, password);
  res.json({ status: "succses" });
};
const registrationConfirmationController = async (req, res) => {
  const { code } = req.params;
  await registrationConfirmationUser(code);
  res.json({ status: "succses" });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const token = await loginUser(email, password);
  return res.json({ status: "sucsess", token });
};
module.exports = {
  registrationController,
  loginController,
  registrationConfirmationController,
};
