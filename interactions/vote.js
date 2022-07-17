import { MessageButton } from "discord.js";
import { findOne } from "../services/memberService.js";
import { getButton } from "../UI/button.js";
import { getVoteEmbed } from "../UI/embeds/voteEmbed.js";
import { getPlate } from "../UI/userPlate.js";

export const vote = async (interaction, settings) => {
  const canVote = await interaction.member.roles.cache.find((role) => {
    return [
      settings[0].candidateId,
      settings[0].registeredStaff,
      settings[0].registeredMangment,
      settings[0].registeredMember,
    ].includes(role.id);
  });
  if (!canVote) {
    return await interaction.editReply({
      content: "Please register to be able to vote.",
      ephemeral: true,
    });
  }
  const mentionedUser = await interaction.options.getUser("username");

  const discordUser = await findOne(mentionedUser.id);

  // recheck this

  if (!discordUser) {
    return await interaction.editReply({
      content: "User not found",
      ephemeral: true,
    });
  }

  if (discordUser.discordId.toString() === interaction.member.id.toString()) {
    return await interaction.editReply({
      content:
        "You cannot vote for yourself, if you wish to see your own profile, use '!myvotes'",
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
        new MessageButton()
          .setCustomId(`skillsId-${discordUser.discordId}`)
          .setDisabled(
            discordUser.skillVoters.includes(interaction.member.id.toString())
          )
          .setLabel("Skills")
          .setStyle("DANGER"),
        new MessageButton()
          .setCustomId(`contributionId-${discordUser.discordId}`)
          .setDisabled(
            discordUser.contributionVoters.includes(
              interaction.member.id.toString()
            )
          )
          .setLabel("Contribution")
          .setStyle("SUCCESS"),
        new MessageButton()
          .setCustomId(`personalityId-${discordUser.discordId}`)
          .setDisabled(
            discordUser.personalityVoters.includes(
              interaction.member.id.toString()
            )
          )
          .setLabel("Personality")
          .setStyle("PRIMARY"),
      ]),
    ],
  });
};
