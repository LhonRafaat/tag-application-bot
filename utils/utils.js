import axios from "axios";

export const getUserProfile = async (
  gameVal,
  gameNameVal,
  platformVal,
  modal
) => {
  try {
    const user = await axios.get(
      `https://api.gametools.network/${gameVal}/all/?format_values=false&name=${gameNameVal}&lang=en-us&platform=${platformVal}`
    );
    return user;
  } catch {
    if (modal) {
      await modal.deferReply({ ephemeral: true });
      return await modal.followUp({
        content: "User not found",

        ephemeral: true,
      });
    }
  }
};
export const getUserByGameId = async (gameId, gameVal, platform) => {
  try {
    const user = await axios.get(
      `https://api.gametools.network/${gameVal}/all/?format_values=false&playerid=${gameId}&lang=en-us&platform=${platform}`
    );
    return user;
  } catch (e) {
    // console.log(e);
    // await modal.deferReply({ ephemeral: true });
    // return modal.followUp({
    //   content: "User not found",
    //   ephemeral: true,
    // });
  }
};

export const games = ["bfv", "bf1", "bf4", "bf3"];
