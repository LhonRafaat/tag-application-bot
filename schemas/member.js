import mongoose from "mongoose";

const { Schema, model } = mongoose;
const membersSchema = new Schema(
  {
    discordId: { type: String, required: true },
    originIds: [{ type: String, required: true }],
    platforms: [{ type: String, required: true }],
    userNames: [{ type: String, required: true }],
    hasTag: { type: Boolean, required: true },
    fullName: { type: String, required: true },
    skills: { type: Number, default: 0 },
    personality: { type: Number, default: 0 },
    contribution: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Members = model("Members", membersSchema);
