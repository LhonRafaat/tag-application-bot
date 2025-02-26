import { EmbedBuilder } from "discord.js";

export function getTicketEmbed() {
  const applicationsEmbed = new EmbedBuilder()
    .setTitle("Thanks for contacting us!")
    .setDescription(
      "**Please describe the reason for contacting us.** \n This chat-channel will be used to communicate with you. \n Our iDF staff will contact you as soon as they become available.We try to reply to tickets within 12 hours."
    );

  return applicationsEmbed;
}
