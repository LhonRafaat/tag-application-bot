import axios from "axios";
import { generateMapEmbed } from "../UI/embeds/generateMapEmbed.js";
import { fetchProfileByNucleusId } from "./utils.js";
import {
  createDFServer,
  getClosedServers,
  getDFServerByName,
  updatePlayerAmount,
} from "../services/dfserverService.js";
import { fetchBfvServerOwner } from "./fetchBfvServerOwner.js";
import { generateBfvMapEmbed } from "../UI/embeds/generateBfvMapEmbed.js";
import { time, TimestampStyles } from "discord.js";

export const fetchBfvServers = async (channel) => {
  // delete all messages in the channel
  const messages = await channel?.messages?.fetch();
  for (const message of messages.values()) {
    await message.delete();
  }

  try {
    const res = await axios.get(
      "https://api.gametools.network/bfv/servers/?name=1v1&platform=pc&limit=50&region=all&lang=en-us"
    );

    const data = res.data?.servers;

    if (data && data.length > 0) {
      for await (const game of data) {
        const detailedServer = await axios.get(
          `https://api.gametools.network/bfv/players/?gameid=${game.gameId}`
        );
        let teams = detailedServer?.data.teams;

        teams = teams.map((team) => {
          return {
            name: team.name,
            img: team.image,
            players: team.players.map(
              (el) => `${el.platoon ? `[${el.platoon}]` : ""}${el.name}`
            ),
          };
        });

        const owner = await fetchBfvServerOwner(game.ownerId);
        const embed = generateBfvMapEmbed(
          game.prefix,
          owner,
          game.playerAmount,
          game.region,
          game.url,
          teams
        );

        await channel.send({
          embeds: [embed],
        });
      }
    } else {
      const relative = time(new Date(), TimestampStyles.RelativeTime);
      await channel.send(
        "** No servers are online **\n\nLast updated: " + relative
      );
    }
  } catch (error) {
    console.log("error occured ");
    console.log(error);
  }
};
