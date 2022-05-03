import Canvas from "canvas";
import { MessageAttachment } from "discord.js";
import { findOne } from "../services/memberService.js";

export const getPlate = async (name, discordId, userAvatar, secondName) => {
  //required points for the votes
  const requiredPoints = 20;
  // 1500 is the width of the white rect
  const unit = 1500 / requiredPoints;
  const user = await findOne(discordId);
  const canvas = Canvas.createCanvas(1700, 550);
  const context = canvas.getContext("2d");

  const background = await Canvas.loadImage("./assets/images/bf-bg.png");
  const idfLogo = await Canvas.loadImage("./assets/images/idf-trans.png");
  var grd = context.createLinearGradient(0, 0, 2, 0);
  grd.addColorStop(0, "#53E3F5");
  grd.addColorStop(1, "#53E3F5");

  // This uses the canvas dimensions to stretch the image onto the entire canvas
  context.drawImage(background, 0, 0, canvas.width, canvas.height);
  context.drawImage(idfLogo, canvas.width - 100, 20);

  const avatar = await Canvas.loadImage(userAvatar);
  const avatarFrame = await Canvas.loadImage("./assets/images/frame.png");

  //the avatar and frame have 15 pixels of space differencem and 42 in high and width,, this is an estimate
  context.drawImage(avatar, 40, 40, 208, 208);
  context.drawImage(avatarFrame, 25, 25, 250, 250);
  context.strokeRect(0, 0, canvas.width, canvas.height);

  // Select the font size and type from one of the natively available fonts
  context.font = "900 50px sans-serif";

  // Select the style that will be used to fill the text in
  context.fillStyle = "#67FFFF";

  // Actually fill the text with a solid color
  context.fillText(name.toUpperCase(), 288, canvas.height / 3.0);
  context.font = "200 40px sans-serif";
  context.fillText(`(${secondName})`, 550, canvas.height / 3.0);

  context.fillText("SKILL", 40, 350);
  context.fillText("CONTRIBUTION", 40, 420);
  context.fillText("PERSONALITY", 40, 490);

  //we repeat fill rect twice once with white once with red to stimulate a progressbar.

  // we multiply each point by the unit to get the correct width

  // context.fillRect(480, 220, user.skills * unit, 10);
  context.fillStyle = "#ffffff";
  context.globalAlpha = 0.2;

  context.fillRect(150, 330, canvas.width / 2, 10);
  context.globalAlpha = 1.0;

  context.fillStyle = grd;
  context.fillRect(canvas.width / 2 + 190, 320, 42, 42);

  context.fillText(user.skills, canvas.width / 2 + 200, 350);

  // Use the helpful Attachment class structure to process the file for you
  const attachment = new MessageAttachment(
    canvas.toBuffer(),
    "profile-image.png"
  );

  return attachment;
};
