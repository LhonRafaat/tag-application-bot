import axios from "axios";

export const fetchBfvServerOwner = async (ownerId) => {
  const owner = await axios.get(`
https://api.gametools.network/bfv/stats/?format_values=true&playerid=${ownerId}&platform=pc&skip_battlelog=false&lang=en-us`);

  return owner?.data?.userName;
};
