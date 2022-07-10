// at the top of your file
import { MessageEmbed } from "discord.js";

const description = `
       Please answer questions below : 
        Question 1: What is your favorite color?
        Question 2: What is your favorite animal?
        Question 3: What is your favorite food?
        Question 4: What is your favorite sport?
        Question 5: What is your favorite movie?
        Question 6: What is your favorite book?
        Question 7: What is your favorite game?

        Please type your answers in this channel, 
        Thanks !
   `;

// inside a command, event listener, etc.
export const questionsEmbed = new MessageEmbed()
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
