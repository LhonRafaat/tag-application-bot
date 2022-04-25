import mongoose from "mongoose";

const { Schema, model } = mongoose;
const membersSchema = new Schema(
  {
    discordId: { type: String, required: true },
    originId: { type: String, required: true },
    platforms: [{ type: String, required: true }],
    hasTag: { type: Boolean, required: true },
    fullName: { type: String, required: true },
    votes : {type: Number , default: 0},
  },
  { timestamps: true }
);

export const Members = model("Members", membersSchema);
