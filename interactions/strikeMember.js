import { findOne } from "../services/memberService.js";
import { strikeUser } from "../services/strikeService.js";
import { isMod } from "../utils/isMod.js";

export const strikeMember = async (interaction, settings) => {
    const isAuthorized = await isMod(interaction, settings);

    if (!isAuthorized) {
      return await interaction.editReply({
        content: "You are not authorized",
        ephemeral: true,
      });
    }

  const username = interaction.options.get("username");
  const degree = interaction.options.get("degree");
  const reason = interaction.options.get("reason");
  const member = await findOne(username.user?.id);

  const payload = {
    member: member?._id,
    degree: degree.value,
    reason: reason.value,
  };

  try {
    await strikeUser(payload);
    switch (degree.value) {
      case 1:
        await interaction.member.roles
          .add(settings[0].strikeOne)
          .catch((err) => {
            console.log("Error" + err);
          });

        break;

      case 2:
        await interaction.member.roles
          .add(settings[0].strikeTwo)
          .catch((err) => {
            console.log("Error" + err);
          });

        break;

      case 3:
        await interaction.member.roles
          .add(settings[0].strikeThree)
          .catch((err) => {
            console.log("Error" + err);
          });

        break;

      default:
        break;
    }
    return interaction.editReply(
      "Success !" +
        "\n " +
        `member: ${member.fullName} \n degree: ${degree.value} \n reason: ${reason.value}`
    );
  } catch (error) {
    return interaction.editReply(error.toString());
  }
};
