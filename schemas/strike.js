import mongoose from "mongoose";
const { Schema, model } = mongoose;

const strikeSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

export const Strike = model("Strike", strikeSchema);
