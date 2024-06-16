import axios from "axios";
import { generateMapEmbed } from "../UI/embeds/generateMapEmbed.js";

export const fetchDogfightServersBF2042 = async (channel) => {
  try {
    const res = await axios.get(
      "https://api.gametools.network/bf2042/servers/?name=1v1&region=all&limit=10"
    );

    const data = res.data;

    if (data) {
      for await (const el of data.servers) {
        const embed = generateMapEmbed(
          el.prefix,
          el.serverId,
          el.playerAmount,
          el.currentMap,
          el.region,
          el.url
        );

        await channel.send({
          embeds: [embed],
          content:
            "------------------------------------------------------------------",
        });
      }
    }

    return res.data;
  } catch (error) {
    console.log("error occured");
  }
};
