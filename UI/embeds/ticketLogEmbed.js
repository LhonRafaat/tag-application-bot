import { EmbedBuilder } from "discord.js";
export function getTicketLogEmbed(
  title,
  openedBy,
  openedAt,
  closedBy,
  closedAt,
  closedReason
) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(
      `Opened by: <@${openedBy}> \nOpened at: ${openedAt} \nClosed by: <@${closedBy}> \nClosed at: ${closedAt} \nClose reason: ${closedReason} \n`
    );

  return embed;
}
