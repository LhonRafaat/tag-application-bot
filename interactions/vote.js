import { ButtonBuilder, ButtonStyle } from "discord.js";
import { findOne } from "../services/memberService.js";
import { getButton } from "../UI/button.js";
import { getVoteEmbed } from "../UI/embeds/voteEmbed.js";
import { getPlate } from "../UI/userPlate.js";
import { hasiDFTag } from "../utils/hasiDFtag.js";

export const vote = async (interaction, settings) => {
  await interaction?.member?.fetch();

  const isiDF = await hasiDFTag(interaction.member, settings);

  if (!isiDF) {
    return await interaction.editReply(
      "Only iDF members are eligible to vote."
    );
  }

  const canVote = await interaction.member.roles.cache.some((role) => {
    return [
      settings[0].candidateId,
      settings[0].registeredStaff,
      settings[0].registeredMangment,
      settings[0].registeredMember,
    ].includes(role.id);
  });
  if (!canVote) {
    return await interaction.editReply({
      content:
        "You are not registered, in order to be able to vote you must register.",
      ephemeral: true,
      components: [
        getButton([
          new ButtonBuilder()
            .setCustomId("registerButton")
            .setLabel("Register")
            .setStyle(ButtonStyle.Success),
        ]),
      ],
    });
  }
  const mentionedUser = await interaction.options.getUser("username");

  const discordUser = await findOne(mentionedUser.id);

  // recheck this

  if (!discordUser) {
    return await interaction.editReply({
      content: "Player you are trying to vote for is not registered.",
      ephemeral: true,
    });
  }

  if (discordUser.discordId.toString() === interaction.member.id.toString()) {
    return await interaction.editReply({
      content:
        "You cannot vote for yourself noty noty, if you wish to see your own profile, use '/mystatus'",
      ephemeral: true,
    });
  }

  //TODO : how can I get the user avatar from discord?

  // I could have just passed the whole user object here instead of passing discord id and fetching it again
  // in the plate, but idk why I did that ...
  const attachment = await getPlate(
    discordUser.userNames[0],
    discordUser.discordId,
    discordUser.avatar,
    discordUser.userNames[1] ? discordUser.userNames[1] : undefined
  );
  //TODO: send a error message when user doesnt exist

  // big problem here, if ephemeral is true, we cannot react to the messag
  await await interaction.editReply({
    embeds: [getVoteEmbed(discordUser.userNames[0], discordUser.discordId)],
    ephemeral: true,
    files: [attachment],
    components: [
      getButton([
        new ButtonBuilder()
          .setCustomId(`skillsId-${discordUser.discordId}`)
          .setDisabled(
            discordUser.skillVoters.includes(interaction.member.id.toString())
          )
          .setLabel("Skills")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`contributionId-${discordUser.discordId}`)
          .setDisabled(
            discordUser.contributionVoters.includes(
              interaction.member.id.toString()
            )
          )
          .setLabel("Contribution")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`personalityId-${discordUser.discordId}`)
          .setDisabled(
            discordUser.personalityVoters.includes(
              interaction.member.id.toString()
            )
          )
          .setLabel("Personality")
          .setStyle(ButtonStyle.Primary),
      ]),
    ],
  });
};
