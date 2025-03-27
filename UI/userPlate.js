import Canvas from "canvas";
import { AttachmentBuilder } from "discord.js";
import { findOne } from "../services/memberService.js";
import { getRequiredPoints } from "../services/settingService.js";

export const getPlate = async (name, discordId, userAvatar, secondName) => {
  //required points for the votes
  // const requiredPoints = 20;
  // 1500 is the width of the white rect
  const requiredPoints = await getRequiredPoints();
  const unit = 1500 / requiredPoints;

  Canvas.registerFont("./assets/fonts/share-regular.ttf", {
    family: "share-regular",
  });
  Canvas.registerFont("./assets/fonts/share-bold.ttf", {
    family: "share-bold",
  });
  const user = await findOne(discordId);
  const canvas = Canvas.createCanvas(1700, 550);
  const context = canvas.getContext("2d");
  // const background = await Canvas.loadImage("./assets/images/bf-bg.png");
  const bg1 = await Canvas.loadImage("./assets/images/new-bg-1.png");
  const bg2 = await Canvas.loadImage("./assets/images/new-bg-2.png");
  const bg3 = await Canvas.loadImage("./assets/images/new-bg-3.png");
  const bg4 = await Canvas.loadImage("./assets/images/new-bg-4.png");
  const idfLogo = await Canvas.loadImage("./assets/images/idf-trans.png");
  var grd = context.createLinearGradient(0, 0, 2, 0);
  grd.addColorStop(0, "#53E3F5");
  grd.addColorStop(1, "#53E3F5");

  // This uses the canvas dimensions to stretch the image onto the entire canvas
  // draw one of the background images randomly
  const random = Math.floor(Math.random() * 4);
  switch (random) {
    case 0:
      context.drawImage(bg1, 0, 0, canvas.width, canvas.height);
      break;
    case 1:
      context.drawImage(bg2, 0, 0, canvas.width, canvas.height);
      break;
    case 2:
      context.drawImage(bg3, 0, 0, canvas.width, canvas.height);
      break;
    case 3:
      context.drawImage(bg4, 0, 0, canvas.width, canvas.height);
      break;
  }
  // context.drawImage(background, 0, 0, canvas.width, canvas.height);
  context.drawImage(idfLogo, canvas.width - 100, 20);
  try {
    const avatar = await Canvas.loadImage(userAvatar);
    context.drawImage(avatar, 43, 43, 210, 215);
  } catch (error) {
    console.log(error);
  }

  const avatarFrame = await Canvas.loadImage("./assets/images/frame-new.png");
  const numBox = await Canvas.loadImage("./assets/images/num-box.png");
  const fillBar = await Canvas.loadImage("./assets/images/fill-bar.png");
  const numBoxFull = await Canvas.loadImage("./assets/images/num-box-full.png");
  const sparkles = await Canvas.loadImage("./assets/images/sparkles.png");
  const shiny = await Canvas.loadImage("./assets/images/shiny.png");
  const moreShiny = await Canvas.loadImage("./assets/images/more-shiny.png");

  // this is the sparkles

  context.globalCompositeOperation = "lighter";
  user.skills > requiredPoints / 2 &&
    context.drawImage(sparkles, 20, 220, 800, 200);
  user.contribution > requiredPoints / 2 &&
    context.drawImage(sparkles, 20, 290, 800, 200);
  user.personality > requiredPoints / 2 &&
    context.drawImage(sparkles, 20, 360, 800, 200);
  context.globalCompositeOperation = "lighter";

  if (user.skills === requiredPoints || user.skills > requiredPoints) {
    context.drawImage(shiny, canvas.width / 2 + 15, 290);
    context.globalCompositeOperation = "lighter";
    context.drawImage(moreShiny, canvas.width / 2 - 50, 320);
  }

  if (
    user.contribution === requiredPoints ||
    user.contribution > requiredPoints
  ) {
    context.drawImage(shiny, canvas.width / 2 + 15, 360);
    context.drawImage(moreShiny, canvas.width / 2 - 50, 390);
  }
  if (
    user.personality === requiredPoints ||
    user.personality > requiredPoints
  ) {
    context.drawImage(shiny, canvas.width / 2 + 15, 430);
    context.drawImage(moreShiny, canvas.width / 2 - 50, 460);
  }

  //the avatar and frame have 15 pixels of space differencem and 42 in high and width,, this is an estimate
  context.drawImage(avatarFrame, 25, 25, 250, 250);
  context.globalCompositeOperation = "source-over";
  context.drawImage(
    user.skills === requiredPoints || user.skills > requiredPoints
      ? numBoxFull
      : numBox,
    canvas.width / 2 + 150,
    315,
    50,
    48
  );
  context.globalCompositeOperation = "source-over";
  context.drawImage(
    user.contribution === requiredPoints || user.contribution > requiredPoints
      ? numBoxFull
      : numBox,
    canvas.width / 2 + 150,
    385,
    50,
    48
  );
  context.globalCompositeOperation = "source-over";
  context.drawImage(
    user.personality === requiredPoints || user.personality > requiredPoints
      ? numBoxFull
      : numBox,
    canvas.width / 2 + 150,
    455,
    50,
    48
  );

  // calculating the fill bar width
  const barLength = canvas.width / 2 / requiredPoints;

  context.globalCompositeOperation = "lighter";
  // the category name characters are not even , so I need to add numbers to make the fill bar even
  context.drawImage(
    fillBar,
    100,
    260,
    user.skills <= requiredPoints
      ? user.skills > 0
        ? user.skills * barLength + 50
        : user.skills * barLength
      : requiredPoints * barLength + 50,
    150
  );
  //make sure the votes are more than 5 then subtract it by 180
  context.globalCompositeOperation = "lighter";
  context.drawImage(
    fillBar,
    150,
    330,
    user.contribution <= requiredPoints
      ? user.contribution > requiredPoints / 4
        ? user.contribution * barLength
        : user.contribution * barLength
      : requiredPoints * barLength,
    150
  );
  context.globalCompositeOperation = "lighter";
  context.drawImage(
    fillBar,
    150,
    400,
    user.personality <= requiredPoints
      ? user.personality * barLength
      : requiredPoints * barLength,
    150
  );

  context.strokeRect(0, 0, canvas.width, canvas.height);

  // Select the font size and type from one of the natively available fonts
  context.font = "64px share-bold";

  // Select the style that will be used to fill the text in
  context.fillStyle = "#67FFFF";

  // Actually fill the text with a solid color
  context.fillText(name.toUpperCase(), 288, canvas.height / 4.0);
  context.font = "40px share-regular";

  // if (secondName) context.fillText(`(${secondName})`, 510, canvas.height / 4.3);
  context.fillStyle = "white";

  context.font = "28px share-regular";

  context.fillText(`KARMA`, 288, canvas.height / 2.8);
  context.fillStyle = "#67FFFF";

  context.fillText(`${user.karma ? user.karma : 0}`, 390, canvas.height / 2.8);

  context.font = "32px share-regular";
  context.fillText("SKILL", 40, 345);
  context.fillText("CONTRIBUTION", 40, 415);
  context.fillText("PERSONALITY", 40, 485);

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

  context.font = "32px share-regular";

  // the number padding look bad when its single number,but when its two it looks better
  context.fillText(
    user.skills,
    user.skills > 9 ? canvas.width / 2 + 160 : canvas.width / 2 + 168,
    350
  );
  context.font = "32px share-regular";

  context.fillText(
    user.contribution,
    user.contribution > 9 ? canvas.width / 2 + 158 : canvas.width / 2 + 168,
    420
  );
  context.font = "32px share-regular";

  context.fillText(
    user.personality,
    user.personality > 9 ? canvas.width / 2 + 158 : canvas.width / 2 + 168,
    490
  );

  // Use the helpful Attachment class structure to process the file for you
  const attachment = new AttachmentBuilder(
    canvas.toBuffer(),
    "profile-image.png"
  );

  return attachment;
};
