import axios from "axios";

export const getUserProfile = async (gameVal, gameNameVal, platformVal) => {
  try {
    const user = await axios.get(
      `https://api.gametools.network/${gameVal}/all/?format_values=false&name=${gameNameVal}&lang=en-us&platform=${platformVal}`
    );
    return user;
  } catch (e) {
    // console.log(e);
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

export const getBf2Profile = async (name) => {
  try {
    const user = await axios.get(
      `https://api.gametools.network/bf2/stats/?format_values=false&name=${name}&lang=en-us&platform=bf2hub`
    );
    return user;
  } catch (e) {
    // console.log(e);
  }
};

export const games = ["bfv", "bf2", "bf1", "bf4", "bf3"];

export function matchYoutubeUrl(url) {
  const links = ["https://youtu.be", "https://youtube.com"];
  const match = links.some((link) => url.includes(link));
  return match;
}
