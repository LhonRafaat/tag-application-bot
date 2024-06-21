import { ButtonBuilder, ButtonStyle, bold } from "discord.js";
import { findOne } from "../services/memberService.js";
import { getRequiredPoints } from "../services/settingService.js";
import { getButton } from "../UI/button.js";
import { getPlate } from "../UI/userPlate.js";
import { hasiDFTag } from "../utils/hasiDFtag.js";
import { games, getBf2Profile, getUserByGameId } from "../utils/utils.js";

export const myStatus = async (interaction, settings) => {
  const user = await findOne(interaction.member.id);

  let isBf2 = false;
  try {
    const requiredPoints = await getRequiredPoints();

    if (!user)
      return await interaction.editReply({
        content: "you are not registered, regsiter here !",
        components: [
          getButton([
            new ButtonBuilder()
              .setCustomId("registerButton")
              .setLabel("Register")
              .setStyle(ButtonStyle.Success),
          ]),
        ],
      });

    const totalPoints = user.skills + user.contribution + user.personality;
    const isiDF = await hasiDFTag(interaction.member, settings);

    let gameProfileData = null;
    for await (const game of games) {
      if (game === "bf2") {
        const bf2Profile = await getBf2Profile(user.bf2profile?.name);
        if (bf2Profile?.data) {
          gameProfileData = bf2Profile.data;
          isBf2 = true;
        }
      }

      try {
        const gameProfile = await getUserByGameId(
          user.originIds[0],
          game,
          user.platforms[0]
        );
        if (gameProfile?.data) {
          gameProfileData = gameProfile;
        }
      } catch (error) {
        console.log(error);
      }

      if (gameProfileData) {
        const plate = await getPlate(
          // taking the first username, maybe we increase it  ?
          !isBf2 ? gameProfileData.data.userName : user.userNames[0],
          user.discordId,
          !isBf2 ? gameProfileData.data?.avatar : user?.avatar,

          user.userNames[1] ? user.userNames[1] : undefined
        );

        return await interaction.editReply({
          files: [plate],
          content:
            (!isiDF
              ? bold(
                  `Achieve ${requiredPoints} points or more to qualify for iDF tag! your current: ${totalPoints}`
                )
              : bold(`Total points: ${totalPoints}`)) +
            "\ndon't forget you can vote for your friends using the /vote command !",
        });
      }
    }
    if (!gameProfileData?.data && !gameProfileData)
      return interaction.editReply({ content: "Game profile not found" });
  } catch (error) {
    console.log(error);
    return await interaction.editReply({
      content: "fetched profile not found",
      ephemeral: true,
    });
  }
};
