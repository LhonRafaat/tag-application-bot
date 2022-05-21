import mongoose from "mongoose";

const { Schema, model } = mongoose;
const settingSchema = new Schema(
  {
    requiredPoints: { type: Number, default: 20 },
    moderatorId: { type: String, default: "977520328404262943" },
    seniorModeratorId: { type: String, default: "962439606505189456" },
    trialModeratorId: { type: String, default: "977520328404262943" },
    designId: { type: String, default: "977520328404262943" },
    forceCodeId: { type: String, default: "962440574768660510" },
    adminId: { type: String, default: "977568930837168200" },
    regIdfId: { type: String, default: "977520328404262943" },
    regStaffId: { type: String, default: "977520328404262943" },
    regAdminId: { type: String, default: "977520328404262943" },
    regMemberId: { type: String, default: "977520328404262943" },
    votingChannelId: { type: String, default: "968131185668665404" },
    ticketsParentId: { type: String, default: "974645473187098654" },
  },
  { timestamps: true }
);

export const Setting = model("Setting", settingSchema);
