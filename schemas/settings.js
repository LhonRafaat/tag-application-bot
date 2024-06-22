import mongoose from "mongoose";

const { Schema, model } = mongoose;
const settingSchema = new Schema(
  {
    requiredPoints: { type: Number, default: 20 },
    msgValue: { type: Number, default: 0.05 },
    rolePingValue: { type: Number, default: 0.5 },
    contentValue: { type: Number, default: 0.5 },
    dfReactionValue: { type: Number, default: 0.5 },

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
    strikeOne: { type: String },
    strikeTwo: { type: String },
    strikeThree: { type: String },
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
    contentCreatorsId: { type: String, default: "548861901539639313" },
    dogfightChannelId: { type: String, default: "916452721341661245" },
    dogfightRolesChannelId: { type: String, default: "859375747432972288" },
    bf2042Channel: { type: String, default: "1252282768184971314" },
    //------------
    //bot id

    botId: { type: String, default: "978712177567465472" },
    idfBotChannelId: { type: String, default: "977523561617047582" },

    // idf roles
    idfXboxId: { type: String, default: "977951821194727434" },
    idfPcId: { type: String, default: "666198649746751499" },
    idfPsId: { type: String, default: "977951821194727434" },

    // df roles
    pcBfv: { type: String, default: "859378094450933790" },
    pcBf1: { type: String, default: "859378753728544799" },
    pcBf4: { type: String, default: "859378575945760780" },
    ps4Bfv: { type: String, default: "859378977872019496" },
    ps4Bf1: { type: String, default: "859379127278633021" },
    ps4Bf4: { type: String, default: "859378977872019496" },
    dcsPc: { type: String, default: "1014922290951106643" },
    xboxBfv: { type: String, default: "859379195787345920" },
    xboxBf1: { type: String, default: "859379127278633021" },
    xboxBf4: { type: String, default: "859379271642644480" },
    allBf2042: { type: String, default: "906472474366083082" },
  },
  { timestamps: true }
);

export const Setting = model("Setting", settingSchema);
