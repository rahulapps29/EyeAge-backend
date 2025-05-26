const mongoose = require("mongoose");

const eyeMeasurementSchema = new mongoose.Schema({
  distance: {
    sph: Number,
    cyl: Number,
    axis: Number,
  },
  near: {
    sph: Number,
    cyl: Number,
    axis: Number,
  },
});

const eyeEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rightEye: eyeMeasurementSchema,
  leftEye: eyeMeasurementSchema,
  sv: Boolean,
  bf: Boolean,
  prog: Boolean,
  hc: Boolean,
  hmc: Boolean,
  bc: Boolean,
  poly: Boolean,
  trio: Boolean,
  violet: Boolean,
  totalAmount: Number,
  advanceAmount: Number,
  balanceAmount: Number, // computed field
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

eyeEntrySchema.pre("save", function (next) {
  this.balanceAmount = this.totalAmount - this.advanceAmount;
  next();
});

module.exports = mongoose.model("EyeEntry", eyeEntrySchema);
