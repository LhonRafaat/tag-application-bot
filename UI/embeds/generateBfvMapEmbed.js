import { EmbedBuilder, TimestampStyles, time } from "discord.js";

export const generateBfvMapEmbed = (
  serverName,
  ownerName,
  currentPlayers,
  region,
  image,
  teams
) => {
  const date = new Date();

  const timeString = time(date);
  const relative = time(date, TimestampStyles.RelativeTime);
  const embed = new EmbedBuilder()
    .setAuthor({
      name: "Server Info",
    })
    .setTitle(serverName)
    .setDescription(
      `- **Owner**: ${ownerName}\n- **Current Players**: ${currentPlayers}\n- **Region**: ${region}\n- **Last Updated**: ${timeString} (${relative})
      \n- **Teams**: \n
      
      **${teams[0].name.toUpperCase()}** :flag_us: 
      ${teams[0].players.map((el) => `- ${el}`).join("\n")}
      \n---------------------------------------------------
       **${teams[1].name.toUpperCase()}** :flag_jp:
      ${teams[1].players.map((el) => `- ${el}`).join("\n")}
      `
    )
    .setImage(image)
    .setThumbnail(
      "https://preview.redd.it/tell-me-5-best-things-and-5-worst-things-about-battlefield-v-v0-kqpyuxmafmxc1.jpeg?auto=webp&s=c37d9c1480c9ec66168201ae43d55c12d0d17a8c"
    )
    .setColor("#f500d4");

  return embed;
};
