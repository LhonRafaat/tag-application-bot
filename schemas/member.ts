import mongoose from "mongoose";

const { Schema, model } = mongoose;
const membersSchema = new Schema<IMember>(
  {
    discordId: { type: String, required: true, unique: true },
    //this can include ps id and xbox id aswell
    originIds: [{ type: String }],
    platforms: [{ type: String }],
    userNames: [{ type: String }],
    hasTag: { type: Boolean },
    avatar: { type: String },
    fullName: { type: String, required: true },
    skills: { type: Number, default: 0 },
    karma: { type: Number, default: 0 },
    personality: { type: Number, default: 0 },
    contribution: { type: Number, default: 0 },
    skillVoters: [{ type: String, required: false }],
    personalityVoters: [{ type: String, required: false }],
    contributionVoters: [{ type: String, required: false }],
    reachedVotes: { type: Boolean, default: false },
    bf2profile: {
      name: { type: String, required: false, unique: true },
    },
  },
  { timestamps: true }
);

export const Members = model("Members", membersSchema);

export interface IMember {
  _id: string;
  discordId: string;
  originIds: string[];
  platforms: string[];
  userNames: string[];
  hasTag: boolean;
  avatar: string;
  fullName: string;
  skills: number;
  karma: number;
  personality: number;
  contribution: number;
  skillVoters: string[];
  personalityVoters: string[];
  contributionVoters: string[];
  reachedVotes: boolean;
  bf2profile: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
