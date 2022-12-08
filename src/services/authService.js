const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sha256 = require("sha256");
const { User } = require("../db/authModel");
const { Verificaton } = require("../db/verificationModel");
const { NotAutorizedError } = require("../helpers/errors");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const registrationUser = async (email, password) => {
  const user = new User({
    email,
    password,
  });
  await user.save();

  const code = sha256(email + process.env.JWT_SECRET);

  const verification = new Verificaton({
    code,
    userId: user._id,
  });
  await verification.save();

  const msg = {
    to: email,
    from: process.env.MASTER_EMAIL,
    subject: "Thenk you for registration, Good Day!)",
    text: `<h1>Please,confirme your email address POST http://localhost:8082/api/auth/registration_confirmation/${code}</h1>`,
    html: `<h1>Please,confirme your email address POST http://localhost:8082/api/auth/registration_confirmation/${code}</h1>`,
  };
  await sgMail.send(msg);
};
const registrationConfirmationUser = async (code) => {
  console.log(code);
  const verification = await Verificaton.findOne({
    code,
    active: false,
  });

  if (!verification) {
    throw new NotAutorizedError(`Invalid or expired confirmation code`);
  }

  const user = await User.findById(verification.userId);
  if (!user) {
    throw new NotAutorizedError(`not user found`);
  }

  verification.active = true;
  await verification.save();
  user.confirmed = true;
  await user.save();

  const msg = {
    to: user.email,
    from: process.env.MASTER_EMAIL,
    subject: "Thenk you for registration, Good Day!)",
    text: "and easy to do anywhere, even with Node.js",
    html: `<h1>Please,confirme your email address POST http://localhost:8082/api/auth/registration_confirmation/:${code}</h1>`,
  };
  await sgMail.send(msg);
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email, confirmed: true });
  if (!user) {
    throw new NotAutorizedError(`no user whis email:${email} found`);
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw new NotAutorizedError(`password is not correct`);
  }
  const token = await jwt.sign(
    {
      _id: user._id,
      createdAt: user.createdAt,
    },
    process.env.JWT_SECRET
  );
  return token;
};
module.exports = {
  registrationUser,
  registrationConfirmationUser,
  loginUser,
};
