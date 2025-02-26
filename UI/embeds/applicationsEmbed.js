import { EmbedBuilder } from "discord.js";

export function getApplicationsEmbed() {
  const applicationsEmbed = new EmbedBuilder()
    .setTitle("Open Ticket")
    .setDescription(
      "Please open a ticket for your application or another reason you wish to contact us for. \nInform us about the reason you are contacting us in the created ticket.A staff member will handle your request as soon as they become available!"
    )
    .setThumbnail(
      "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736"
    );

  return applicationsEmbed;
}
