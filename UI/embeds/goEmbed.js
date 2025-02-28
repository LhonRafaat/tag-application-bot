import { EmbedBuilder } from "discord.js";

export function goEmbed() {
  const embed = new EmbedBuilder().setTitle("Explanation of Procedure")
    .setDescription(`Follow the steps below.\n\n**1.Rules**\nYou have access to the **#rules** channel.\n**2.Confirmation**\nPlease read and confirm the rules at the bottom.\n**3.Member**\nThe Member role will be assigned automatically after confirmation.\n**4.Roles**\nCheck **#bot-dogfight-roles** and select your roles. this channel will be available after you confirm the rules.
        \n**Clan Tag information**\nCheck **#getting-started** for more information.
        \n**Have a good time and**\nwe wish you a pleasant stay! \n

        `);

  return embed;
}
