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
  const numBox = await Canvas.loadImage("./assets/images/num-box.png");
  const fillBar = await Canvas.loadImage("./assets/images/fill-bar.png");
  const numBoxFull = await Canvas.loadImage("./assets/images/num-box-full.png");
  const sparkles = await Canvas.loadImage("./assets/images/sparkles.png");
  const shiny = await Canvas.loadImage("./assets/images/shiny.png");
  const moreShiny = await Canvas.loadImage("./assets/images/more-shiny.png");

  //the avatar and frame have 15 pixels of space differencem and 42 in high and width,, this is an estimate
  context.drawImage(avatar, 40, 40, 208, 208);
  context.drawImage(avatarFrame, 25, 25, 250, 250);
  context.drawImage(
    20 === 20 ? numBoxFull : numBox,
    canvas.width / 2 + 150,
    309,
    55,
    55
  );
  context.drawImage(
    user.contribution === 20 ? numBoxFull : numBox,
    canvas.width / 2 + 150,
    449,
    55,
    55
  );
  context.drawImage(
    user.personality === 20 ? numBoxFull : numBox,
    canvas.width / 2 + 150,
    379,
    55,
    55
  );
  context.globalCompositeOperation = "lighter";
  context.drawImage(sparkles, 20, 220, 800, 200);
  context.drawImage(sparkles, 20, 290, 800, 200);
  context.drawImage(sparkles, 20, 360, 800, 200);
  context.globalCompositeOperation = "lighter";
  context.drawImage(shiny, canvas.width / 2 + 30, 290);
  context.drawImage(moreShiny, canvas.width / 2 - 50, 320);
  // calculating the fill bar width
  const barLength = canvas.width / 2 / requiredPoints;

  context.globalCompositeOperation = "lighter";
  // the category name characters are not even , so I need to add numbers to make the fill bar even
  context.drawImage(fillBar, 100, 260, 20 * barLength + 50, 150);
  context.drawImage(fillBar, 330, 330, 19 * barLength - 180, 150);
  context.drawImage(fillBar, 150, 400, 19 * barLength, 150);

  context.strokeRect(0, 0, canvas.width, canvas.height);

  // Select the font size and type from one of the natively available fonts
  context.font = "900 50px sans-serif";

  // Select the style that will be used to fill the text in
  context.fillStyle = "#67FFFF";

  // Actually fill the text with a solid color
  context.fillText(name.toUpperCase(), 288, canvas.height / 4.0);
  context.font = "400 40px sans-serif";
  if (user.secondName)
    context.fillText(`(${secondName})`, 550, canvas.height / 4.0);
  context.fillStyle = "white";

  context.fillText(`KARMA`, 288, canvas.height / 2.5);
  context.fillStyle = "#67FFFF";

  context.fillText(`${user.karma ? user.karma : 0}`, 450, canvas.height / 2.5);

  context.font = "400 35px sans-serif";

  context.fillText("SKILL", 40, 350);
  context.fillText("CONTRIBUTION", 40, 420);
  context.fillText("PERSONALITY", 40, 490);

  //we repeat fill rect twice once with white once with red to stimulate a progressbar.

  // we multiply each point by the unit to get the correct width

  // context.fillRect(480, 220, user.skills * unit, 10);
  context.fillStyle = "#ffffff";

  context.globalAlpha = 0.1;
  context.fillRect(150, 330, canvas.width / 2, 10);
  context.fillRect(150, 400, canvas.width / 2, 10);
  context.fillRect(150, 470, canvas.width / 2, 10);
  context.globalAlpha = 1.0;

  // context.fillStyle = grd;
  // context.fillRect(canvas.width / 2 + 190, 320, 42, 42);

  context.font = "600 30px sans-serif";

  context.fillText("20", canvas.width / 2 + 158, 350);
  context.fillText("19", canvas.width / 2 + 158, 420);
  context.fillText("10", canvas.width / 2 + 158, 490);

  // Use the helpful Attachment class structure to process the file for you
  const attachment = new MessageAttachment(
    canvas.toBuffer(),
    "profile-image.png"
  );

  return attachment;
};
