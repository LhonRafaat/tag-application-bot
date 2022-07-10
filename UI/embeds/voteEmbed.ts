// at the top of your file
import { MessageEmbed } from "discord.js";
import {
  CONTRIBUTION_EMOJI,
  PERSONALITY_EMOJI,
  SKILL_EMOJI,
} from "../../emojies/emojies.ts";

// inside a command, event listener, etc.
export const getVoteEmbed = (name) => {
  const voteEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`Vote for a ${name}`)
    .setURL("https://discord.js.org/")
    .setAuthor({
      name: "iDF",
      iconURL:
        "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736",
      url: "https://discord.js.org",
    })
    .setDescription(
      "to vote for, please react to each reaction below accordingly"
    )
    .setThumbnail(
      "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736"
    )
    .addFields(
      { name: "Skill", value: SKILL_EMOJI, inline: true },
      { name: "Contribution", value: CONTRIBUTION_EMOJI, inline: true },
      { name: "Personality", value: PERSONALITY_EMOJI, inline: true }
    );
  // .setImage(
  //   "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736"
  // )
  // .setFooter({
  //   text: "Some footer text here",
  //   iconURL:
  //     "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736",
  // });

  return voteEmbed;
};
