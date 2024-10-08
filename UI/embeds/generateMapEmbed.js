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
      "https://cdn.discordapp.com/attachments/967381487924150322/1293316522277601462/DA7795C0-9BB8-4D7F-9FB9-3EF28D032BEB.jpg?ex=6706ee5f&is=67059cdf&hm=fc10535d8d36f28cac0613087a55fe0bb7617fe8cb97133767d2b34f03c5ef18&"
    )
    .setColor("#f500d4");

  return embed;
};
