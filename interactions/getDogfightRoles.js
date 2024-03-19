import { dogfightRulesPcEmbed } from "../UI/embeds/dogfightRulesPcEmbed.js";
import { dogfightRulesPsEmbed } from "../UI/embeds/dogfightRulesPsEmbed.js";
import { dogfightRulesXboxEmbed } from "../UI/embeds/dogfightRulesXboxEmbed.js";
import { BF4 } from "../emojies/emojies.js";

export const getDogfightRoles = async (interaction, settings, client) => {
  // dogfight roles

  //   const dogfightRolesChannelId = settings[0].dogfightRolesChannelId;

  try {
    const dogfightRolesChannel = await client.channels.fetch(
      interaction.channelId
    );

    dogfightRolesChannel
      .send({
        content:
          "React to add a specific role. These roles can be pinged by everyone. Use it to find dogfight partners for a certain title. Make sure you pick the right platform.",
        embeds: [dogfightRulesPcEmbed],
      })
      .then((embedMessage) => {
        console.log(BF4);
        embedMessage.react(BF4).catch((e) => console.log(e));
      });
    dogfightRolesChannel
      .send({
        embeds: [dogfightRulesPsEmbed],
      })
      .then((embedMessage) => {
        embedMessage.react("👍").catch((e) => console.log(e));
      });
    dogfightRolesChannel
      .send({
        embeds: [dogfightRulesXboxEmbed],
      })
      .then((embedMessage) => {
        embedMessage.react("👍").catch((e) => console.log(e));
      });
  } catch (error) {
    console.log(error);
  }

  return;
};
