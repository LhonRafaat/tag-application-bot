// at the top of your file
import { MessageEmbed } from "discord.js";

// inside a command, event listener, etc.
export const voteEmbed = new MessageEmbed()
  .setColor("#0099ff")
  .setTitle("Vote for a user")
  .setURL("https://discord.js.org/")
  .setAuthor({
    name: "iDF",
    iconURL:
      "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736",
    url: "https://discord.js.org",
  })
  .setDescription("Vote for a desired user")
  .setThumbnail(
    "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736"
  )
  .addFields(
    { name: "Skill", value: "🍎", inline: true },
    { name: "Contribution", value: "🍊", inline: true },
    { name: "Personality", value: "🍇", inline: true }
  )
  .setImage(
    "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736"
  )
  .setFooter({
    text: "Some footer text here",
    iconURL:
      "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736",
  });
