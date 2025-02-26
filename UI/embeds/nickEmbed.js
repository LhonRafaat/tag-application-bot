import { EmbedBuilder } from "discord.js";

export function nickEmbed() {
  const embed = new EmbedBuilder()
    .setTitle("Nickname not matching")
    .setDescription(
      `Please match your Discord nickname with your ingame nickname. \n**How to** \nEdit your nickname by rightclicking on your name within this chat. It is a local setting on our server and wont affect your global nickname. \n`
    );

  return embed;
}
