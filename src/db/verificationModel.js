const mongoose = require("mongoose");
const verificationShema = mongoose.Schema({
  code: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  active: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
});

const Verificaton = mongoose.model("Verificaton", verificationShema);
module.exports = { Verificaton };
