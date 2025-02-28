import { ChannelType, PermissionFlagsBits } from "discord.js";
import { getTicketEmbed } from "../UI/embeds/ticketEmbed.js";

export async function openTicket(interaction, settings, client) {
  const guild = await client.guilds?.cache.get(process.env.GUILD_ID);
  if (!guild) return;
  const role = await guild.roles.cache.find((role) => {
    return role.name === "@everyone";
  });
  const mods = await guild.roles.cache.find((role) => {
    return role.id === settings[0].modId;
  });
  const newChannel = await guild.channels.create({
    name: `ticket-${settings[0].ticketCounter}`,
    type: ChannelType.GuildText,
    parent: settings[0].ticketsParentId,
    permissionOverwrites: [
      {
        id: interaction.user.id,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: role.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: mods.id,
        allow: [PermissionFlagsBits.ViewChannel],
      },
    ],
  });

  settings[0].ticketCounter += 1;
  await settings[0].save();
  await newChannel.send({
    embeds: [getTicketEmbed()],
  });
  return await interaction.editReply({
    content: `Ticket created in <#${newChannel.id}>`,
    ephemeral: true,
  });
}
