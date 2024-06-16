import { EmbedBuilder } from "discord.js";

export const generateMapEmbed = (
  serverName,
  serverId,
  currentPlayers,
  currentMap,
  region,
  image
) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: "server info",
    })
    .setTitle(serverName)
    .setDescription(
      `- **Server Id**: ${serverId}\n- **Current Players**: ${currentPlayers}\n- **Current Map**: ${currentMap}\n- **Region**: ${region}`
    )
    .setImage(image)
    // .setThumbnail(
    //   "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736"
    // )
    .setColor("#f500d4");

  return embed;
};
