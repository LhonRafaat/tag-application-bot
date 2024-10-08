import { EmbedBuilder, TimestampStyles, time } from "discord.js";

export const generateMapEmbed = (
  serverName,
  serverId,
  currentPlayers,
  status,
  region,
  image
) => {
  const date = new Date();

  const timeString = time(date);
  const relative = time(date, TimestampStyles.RelativeTime);
  const embed = new EmbedBuilder()
    .setAuthor({
      name: "server info",
    })
    .setTitle(serverName)
    .setDescription(
      `- **Owner**: ${serverId}\n- **Current Players**: ${currentPlayers}\n- **Status**: ${status}\n- **Region**: ${region}\n- **Last Updated**:(${relative})`
    )
    .setImage(image)
    .setThumbnail(
      "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736"
    )
    .setColor("#f500d4");

  return embed;
};
