import { dogfightRulesPcEmbed } from "../UI/embeds/dogfightRulesPcEmbed.js";
import { dogfightRulesPsEmbed } from "../UI/embeds/dogfightRulesPsEmbed.js";
import { dogfightRulesXboxEmbed } from "../UI/embeds/dogfightRulesXboxEmbed.js";
import { BF1, BF2042, BF4, BF6, BFV, DCS } from "../emojies/emojies.js";
import { isMod } from "../utils/isMod.js";

export const getDogfightRoles = async (interaction, settings, client) => {
  // dogfight roles

  //   const dogfightRolesChannelId = settings[0].dogfightRolesChannelId;

  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.reply({
      content: "Get out of here kid",
      ephemeral: true,
    });
  }

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
        embedMessage.react(BF4).catch((e) => console.log(e));
        embedMessage.react(BF1).catch((e) => console.log(e));
        embedMessage.react(BFV).catch((e) => console.log(e));
        embedMessage.react(BF2042).catch((e) => console.log(e));
        embedMessage.react(DCS).catch((e) => console.log(e));
        embedMessage.react(BF6).catch((e) => console.log(e));
      });
    dogfightRolesChannel
      .send({
        embeds: [dogfightRulesPsEmbed],
      })
      .then((embedMessage) => {
        embedMessage.react(BF4).catch((e) => console.log(e));
        embedMessage.react(BF1).catch((e) => console.log(e));
        embedMessage.react(BFV).catch((e) => console.log(e));
        embedMessage.react(BF2042).catch((e) => console.log(e));
        embedMessage.react(BF6).catch((e) => console.log(e));
      });
    dogfightRolesChannel
      .send({
        embeds: [dogfightRulesXboxEmbed],
      })
      .then((embedMessage) => {
        embedMessage.react(BF4).catch((e) => console.log(e));
        embedMessage.react(BF1).catch((e) => console.log(e));
        embedMessage.react(BFV).catch((e) => console.log(e));
        embedMessage.react(BF2042).catch((e) => console.log(e));
        embedMessage.react(BF6).catch((e) => console.log(e));
      });
  } catch (error) {
    console.log(error);
  }

  return;
};
