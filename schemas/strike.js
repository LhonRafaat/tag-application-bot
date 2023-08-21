import mongoose from "mongoose";
import validator from "validator";
const { Schema, model } = mongoose;

const strikeSchema = new Schema({
  member: { type: Schema.Types.ObjectId, required: true, ref: "Members" },
  degree: { type: Number, required: true },
  reason: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["active", "resolved"],
    required: true,
    default: "active",
  },
});

export const Strike = model("Strike", strikeSchema);
