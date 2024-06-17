import { DFServer } from "../schemas/dfserver.js";

export const getAlldfServers = async () => {
  const dfServers = await DFServer.find();
  return dfServers;
};

export const getClosedServers = async (upServerIds) => {
  const closedServers = await DFServer.find({
    serverId: { $nin: upServerIds },
  });

  return closedServers;
};

export const getDFServerByName = async (name) => {
  const dfServer = await DFServer.findOne({ name });
  return dfServer;
};

export const createDFServer = async (data) => {
  const dfServer = await DFServer.create(data);

  return dfServer;
};

export const updatePlayerAmount = async (name, playerAmount) => {
  const dfServer = await DFServer.findOne({ name });
  if (!dfServer) return;
  dfServer.playerAmount = playerAmount;
  await dfServer.save();
  return dfServer;
};
