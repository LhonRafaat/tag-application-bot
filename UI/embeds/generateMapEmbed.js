import dayjs from "dayjs";
import { EmbedBuilder } from "discord.js";

export const generateMapEmbed = (
  serverName,
  serverId,
  currentPlayers,
  status,
  region,
  image
) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: "server info",
    })
    .setTitle(serverName)
    .setDescription(
      `- **Owner**: ${serverId}\n- **Current Players**: ${currentPlayers}\n- **Status**: ${status}\n- **Region**: ${region} \n- **Last Updated**: ${dayjs().format(
        "MMMM D YYYY, h:mm:ss a"
      )}`
    )
    .setImage(image)
    .setThumbnail(
      "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736"
    )
    .setColor("#f500d4");

  return embed;
};
