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
      "https://i.namu.wiki/i/WWaZjrK6XJkO8IYRQSA64DSX-EISMeKLjuSMu9eXijktor1SYAqbRLX3xI-uQ4CI6v8VLkblNWYnIlwx77ngQg.webp"
    )
    .setColor("#f500d4");

  return embed;
};
