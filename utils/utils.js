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
    await modal.deferReply({ ephemeral: true });
    return modal.followUp({
      content: "User not found",

      ephemeral: true,
    });
  }
};
