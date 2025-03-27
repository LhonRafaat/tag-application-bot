import mongoose from "mongoose";

const { Schema, model } = mongoose;
const membersSchema = new Schema(
  {
    discordId: { type: String, required: true, unique: true },
    //this can include ps id and xbox id aswell
    originIds: [{ type: String }],
    platforms: [{ type: String }],
    userNames: [{ type: String }],
    games: [{ type: String }],
    hasTag: { type: Boolean },
    avatar: { type: String },
    fullName: { type: String, required: true },
    skills: { type: Number, default: 0 },
    karma: { type: Number, default: 0 },
    personality: { type: Number, default: 0 },
    contribution: { type: Number, default: 0 },
    msgContribution: { type: Number, default: 0 },
    rolePingContribution: { type: Number, default: 0 },
    contentContribution: { type: Number, default: 0 },
    dfReactionContribution: { type: Number, default: 0 },
    skillVoters: [{ type: String, required: false }],
    personalityVoters: [{ type: String, required: false }],
    contributionVoters: [{ type: String, required: false }],
    votingChannelEnabled: { type: Boolean, default: false },
    reachedVotes: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    bf2profile: [
      {
        name: { type: String, required: false, unique: true },
      },
    ],
  },
  { timestamps: true }
);

export const Members = model("Members", membersSchema);
