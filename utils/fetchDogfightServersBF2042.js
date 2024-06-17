import axios from "axios";
import { generateMapEmbed } from "../UI/embeds/generateMapEmbed.js";
import { fetchProfileByNucleusId } from "./utils.js";
import {
  createDFServer,
  getClosedServers,
  getDFServerByName,
  updatePlayerAmount,
} from "../services/dfserverService.js";

export const fetchDogfightServersBF2042 = async (channel) => {
  // delete all messages in the channel
  const messages = await channel?.messages?.fetch();
  for (const message of messages.values()) {
    await message.delete();
  }
  try {
    const res = await axios.get(
      "https://api.gametools.network/bf2042/servers/?name=looping station&region=all&limit=10"
    );

    const data = res.data;
    const upServers = [];

    if (data) {
      for await (const el of data.servers) {
        const name = el.prefix;
        if (name.includes("1v1 Looping Station")) {
          let dfServer;
          dfServer = await getDFServerByName(el.prefix);
          const owner = await fetchProfileByNucleusId(
            el.owner?.nucleusId,
            el?.owner?.platform
          );
          if (!dfServer) {
            dfServer = await createDFServer({
              name: el.prefix,
              playerAmount: el.playerAmount,
              isUp: true,
              owner: owner.userName,
              region: el.region,
              url: el.url,
              serverId: el.serverId,
            });
          }
          dfServer.isUp = true;
          upServers.push(dfServer.serverId);
          await dfServer.save();
          // check if players joined or left
          let playerStatus;
          if (el.playerAmount > dfServer.playerAmount) {
            playerStatus =
              "(" + (el.playerAmount - dfServer.playerAmount) + " joined" + ")";
          } else if (el.playerAmount === dfServer.playerAmount) {
            playerStatus = "";
          } else {
            playerStatus =
              "(" + (dfServer.playerAmount - el.playerAmount) + " left" + ")";
          }

          const embed = generateMapEmbed(
            el.prefix,
            owner.userName,
            el.playerAmount + ` ${playerStatus}`,
            "OPEN",
            el.region,
            el.url
          );

          await updatePlayerAmount(el.prefix, el.playerAmount);

          await channel.send({
            embeds: [embed],
          });
        }
      }
    }

    const closedServers = await getClosedServers(upServers);
    for await (const closedServer of closedServers) {
      const dfServer = await getDFServerByName(closedServer.name);
      dfServer.isUp = false;
      dfServer.playerAmount = 0;
      await dfServer.save();

      const embed = await generateMapEmbed(
        closedServer.name,
        closedServer.owner,
        closedServer.playerAmount,
        "CLOSED",
        closedServer.region,
        closedServer.url
      );
      await channel.send({
        embeds: [embed],
      });
    }

    return res.data;
  } catch (error) {
    console.log("error occured ");
    console.log(error);
  }
};
