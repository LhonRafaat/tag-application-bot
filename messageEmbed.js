// at the top of your file
import { MessageEmbed } from "discord.js";

// inside a command, event listener, etc.
export const tagEmbed = new MessageEmbed()
  .setColor("#0099ff")
  .setTitle("Vote for a user")
  .setURL("https://discord.js.org/")
  .setAuthor({
    name: "Me",
    iconURL: "https://i.imgur.com/AfFp7pu.png",
    url: "https://discord.js.org",
  })
  .setDescription("Vote for a desired user")
  .setThumbnail("https://i.imgur.com/AfFp7pu.png")
  .addFields(
    { name: "Regular field title", value: "Some value here" },
    { name: "\u200B", value: "\u200B" },
    { name: "Inline field title", value: "Some value here", inline: true },
    { name: "Inline field title", value: "Some value here", inline: true }
  )
  .addField("Inline field title", "Some value here", true)
  .setImage("https://i.imgur.com/AfFp7pu.png")
  .setTimestamp()
  .setFooter({
    text: "Some footer text here",
    iconURL: "https://i.imgur.com/AfFp7pu.png",
  });
