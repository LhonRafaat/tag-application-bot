import mongoose from "mongoose";

const { Schema, model } = mongoose;
const settingSchema = new Schema(
  {
    requiredPoints: { type: Number, default: 20 },
  },
  { timestamps: true }
);

export const Setting = model("Setting", settingSchema);
