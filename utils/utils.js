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

export const games = ["bfv", "bf2", "bf1", "bf4", "bf3", "bf2042"];

export function matchYoutubeUrl(url) {
  const links = ["youtu.be", "youtube.com"];
  const match = links.some((link) => url.includes(link));
  return match;
}

export function isDifferenceGreaterThanMonths(date1, date2, months) {
  // Calculate the difference in milliseconds
  const differenceInMilliseconds = Math.abs(date1 - date2);

  // Define the number of milliseconds in the specified number of months
  const millisecondsInMonths = months * 30 * 24 * 60 * 60 * 1000;

  // Compare the difference with the specified number of months
  return differenceInMilliseconds > millisecondsInMonths;
}
