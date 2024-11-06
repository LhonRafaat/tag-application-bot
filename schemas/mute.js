import mongoose from "mongoose";

const { Schema, model } = mongoose;
const muteSchema = new Schema(
  {
    discordId: { type: String, required: true, unique: true },
    prevRoles: [{ type: String }],
    muted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Mute = model("Mute", muteSchema);
