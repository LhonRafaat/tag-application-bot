import mongoose from "mongoose";

const { Schema, model } = mongoose;

const inviteSchema = new Schema({
  inviteCode: String,
  uses: Number,
  inviter: String, // Store inviter's ID
});

export const Invite = model("Invite", inviteSchema);
