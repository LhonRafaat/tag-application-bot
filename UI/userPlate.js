import Canvas from "canvas";
import { MessageAttachment } from "discord.js";
import { findOne } from "../services/memberService.js";

export const getPlate = async (name, discordId, userAvatar) => {
  //required points for the votes
  const requiredPoints = 20;
  // 1500 is the width of the white rect
  const unit = 1500 / requiredPoints;
  const user = await findOne(discordId);
  const canvas = Canvas.createCanvas(1500, 500);
  const context = canvas.getContext("2d");

  const background = await Canvas.loadImage("./assets/images/space.png");

  // This uses the canvas dimensions to stretch the image onto the entire canvas
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  const avatar = await Canvas.loadImage(userAvatar);
  context.drawImage(avatar, 25, 25, 200, 200);
  context.strokeRect(0, 0, canvas.width, canvas.height);

  // Select the font size and type from one of the natively available fonts
  context.font = "80px sans-serif";

  // Select the style that will be used to fill the text in
  context.fillStyle = "#ffffff";

  // Actually fill the text with a solid color
  context.fillText(name, canvas.width / 5.5, canvas.height / 3.0);
  context.font = "50px sans-serif";
  context.fillText("Skills :", canvas.width / 5.5, canvas.height / 2.0);
  context.fillText("Contribution :", 100, canvas.height / 1.6);
  context.fillText("Personality: ", 140, canvas.height / 1.3);
  //we repeat fill rect twice once with white once with red to stimulate a progressbar.
  context.fillStyle = "#ffffff";
  context.fillRect(480, 220, 1000, 20);
  context.fillStyle = "#ff0000";

  // we multiply each point by the unit to get the correct width

  context.fillRect(480, 220, user.skills * unit, 20);
  context.fillStyle = "#ffffff";
  context.fillRect(480, 300, 1000, 20);
  context.fillStyle = "#ff0000";

  context.fillRect(480, 300, user.contribution * unit, 20);
  context.fillStyle = "#ffffff";

  context.fillRect(480, 370, 1000, 20);
  context.fillStyle = "#ff0000";

  context.fillRect(480, 370, user.personality * unit, 20);

  // Use the helpful Attachment class structure to process the file for you
  const attachment = new MessageAttachment(
    canvas.toBuffer(),
    "profile-image.png"
  );

  return attachment;
};
