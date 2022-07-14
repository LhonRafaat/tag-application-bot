import { findOne } from "../services/memberService.js";
import { getPlate } from "../UI/userPlate.js";
import { games, getBf2Profile, getUserProfile } from "../utils/utils.js";

export const myStatus = async (interaction) => {
  const user = await findOne(interaction.member.id);
  let isBf2 = false;
  try {
    if (!user)
      return await interaction.editReply({ content: "you are not registered" });
    // console.log(user.originIds[0]);
    // let platform;
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
        const gameProfile = await getUserProfile(
          game,
          user.userNames[0],
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

        return await interaction.editReply({ files: [plate] });
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
