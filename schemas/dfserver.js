import { Schema, model } from "mongoose";

const DFServerSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    serverId: { type: String, required: false }, // gonna make this optional coz sometimes cant know the id of the server so just gonna use the server name
    playerAmount: { type: Number, default: 0 },
    isUp: { type: Boolean, default: false },
    owner: { type: String, required: true },
    region: { type: String, required: true },
    url: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const DFServer = model("DFServer", DFServerSchema);
