// at the top of your file
import { EmbedBuilder } from "discord.js";

const description = `
   iDF is a community of players who enjoy playing games together.
   We are a group of players who enjoy playing together and have a lot of fun.
   to join us, please click the button below.
   to vote for a player to join us, please click the button below.
   `;

// inside a command, event listener, etc.
export const tagEmbed = new EmbedBuilder()
  .setColor("#0099ff")
  .setTitle("iDF Tag Appplication")
  // .setURL("https://discord.js.org/")
  .setAuthor({
    name: "iDF",
    iconURL:
      "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736",
    url: "https://discord.js.org",
  })
  .setDescription(description);
// .setThumbnail(
//   "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736"
// )
// .addFields(
//   { name: "Regular field title", value: "Some value here" },
//   { name: "\u200B", value: "\u200B" },
//   { name: "Inline field title", value: "Some value here", inline: true },
//   { name: "Inline field title", value: "Some value here", inline: true }
// )
// .setImage(
//   "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736"
// )
// .setFooter({
//   text: "Some footer text here",
//   iconURL:
//     "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736",
// });
