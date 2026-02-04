import axios from "axios";
import { createCanvas, loadImage } from "canvas";
import { AttachmentBuilder } from "discord.js";

export const getUserProfile = async (gameVal, gameNameVal, platformVal) => {
  try {
    const endpoint = gameVal === "bf6" ? "stats" : "all";
    const user = await axios.get(
      `https://api.gametools.network/${gameVal}/${endpoint}/?format_values=false&name=${gameNameVal}&lang=en-us&platform=${platformVal}`,
    );
    return user;
  } catch (e) {
    // console.log(e);
  }
};
export const getUserByGameId = async (gameId, gameVal, platform) => {
  try {
    const endpoint = gameVal === "bf6" ? "stats" : "all";
    const user = await axios.get(
      `https://api.gametools.network/${gameVal}/${endpoint}/?format_values=false&playerid=${gameId}&lang=en-us&platform=${platform}`,
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
      `https://api.gametools.network/bf2/stats/?format_values=false&name=${name}&lang=en-us&platform=bf2hub`,
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

export const createAttachmentFromImageUrl = async (imageUrl) => {
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Load the image into a canvas
    const image = await loadImage(buffer);

    // Set canvas dimensions to 200x200 pixels
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext("2d");

    // Draw the image onto the canvas, resizing it to 200x200 pixels
    ctx.drawImage(image, 0, 0, 200, 200);

    // Create an attachment from the canvas buffer
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "map.png",
    });

    return attachment;
  } catch (error) {
    console.error("Error creating attachment:", error);
    throw error;
  }
};

export const fetchProfileByNucleusId = async (id, platform) => {
  const res = await axios.get(
    `https://api.gametools.network/bf2042/stats/?raw=false&format_values=true&nucleus_id=${id}&platform=${platform}`,
  );

  return res.data;
};
