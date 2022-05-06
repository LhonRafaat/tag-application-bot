import mongoose from "mongoose";

const { Schema, model } = mongoose;
const membersSchema = new Schema(
  {
    discordId: { type: String, required: true },
    //this can include ps id and xbox id aswell
    originIds: [{ type: String, required: true }],
    platforms: [{ type: String, required: true }],
    userNames: [{ type: String, required: true }],
    hasTag: { type: Boolean, required: true },
    avatar: { type: String, required: true },
    fullName: { type: String, required: true },
    skills: { type: Number, default: 0 },
    karma: { type: Number, default: 0 },
    personality: { type: Number, default: 0 },
    contribution: { type: Number, default: 0 },
    skillVoters: [{ type: String, required: false }],
    personalityVoters: [{ type: String, required: false }],
    contributionVoters: [{ type: String, required: false }],
  },
  { timestamps: true }
);

export const Members = model("Members", membersSchema);
