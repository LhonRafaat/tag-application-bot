import mongoose from "mongoose";

const { Schema, model } = mongoose;
const settingSchema = new Schema(
  {
    requiredPoints: { type: Number, default: 20 },
    msgValue: { type: Number, default: 0.05 },
    //------------------
    // member ids
    moderatorId: { type: String, default: "977520328404262943" },
    seniorModeratorId: { type: String, default: "962439606505189456" },
    trialModeratorId: { type: String, default: "977520328404262943" },
    designId: { type: String, default: "977520328404262943" },
    forceCodeId: { type: String, default: "962440574768660510" },
    adminId: { type: String, default: "977568930837168200" },
    modId: { type: String, default: "548861871013494784" },
    founderId: { type: String, default: "977522446427103262" },
    headAdminId: { type: String, default: "977522446427103262" },
    // -----------------
    // registered members id
    registeredMember: { type: String, default: "977951821194727434" },
    registeredStaff: { type: String, default: "977951821194727434" },
    registeredMangment: { type: String, default: "977951821194727434" },
    candidateId: { type: String, default: "977951821194727434" },

    // -----------------
    // channels id
    votingChannelId: { type: String, default: "968131185668665404" },
    ticketsParentId: { type: String, default: "946010863805014037" },
    //------------
    //bot id

    botId: { type: String, default: "978712177567465472" },
    idfBotChannelId: { type: String, default: "977523561617047582" },

    // idf roles
    idfXboxId: { type: String, default: "977951821194727434" },
    idfPcId: { type: String, default: "666198649746751499" },
    idfPsId: { type: String, default: "977951821194727434" },
  },
  { timestamps: true }
);

export const Setting = model("Setting", settingSchema);
