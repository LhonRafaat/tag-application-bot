import Canvas from "canvas";
import { AttachmentBuilder } from "discord.js";
import { findOne } from "../services/memberService.js";
import { getRequiredPoints } from "../services/settingService.js";

function drawNumBox(ctx, x, y, width, height, isFull, value, context) {
  // white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, width, height);

  // border

  // number inside (centered)
  context.globalCompositeOperation = "source-over";

  ctx.fillStyle = "#000000";
  ctx.font = "28px share-regular";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(value, x + width / 2, y + height / 2);
}
function drawProgressBar(x, y, value, context, requiredPoints, canvas) {
  const progress = Math.min(value / requiredPoints, 1);

  const barMaxWidth = canvas.width / 2; // max length
  const barHeight = 20;
  const tailWidth = 10; // width of the black tail

  // background (semi-transparent white)
  context.fillStyle = "rgba(255, 255, 255, 0.2)";
  context.fillRect(x, y, barMaxWidth, barHeight);

  // filled bar (white)
  const filledWidth = barMaxWidth * progress;
  context.fillStyle = "#ffffff";
  context.fillRect(x, y, filledWidth, barHeight);

  // black tail at the end of the filled bar
  if (filledWidth > 0 && filledWidth < barMaxWidth) {
    console.log("here");
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "#000000";
    context.fillRect(x + filledWidth, y, tailWidth, barHeight);
  }
}

export const getPlate = async (name, discordId, userAvatar, secondName) => {
  try {
    const requiredPoints = await getRequiredPoints();

    Canvas.registerFont("./assets/fonts/new-font.ttf", {
      family: "share-regular",
    });
    Canvas.registerFont("./assets/fonts/new-font.ttf", {
      family: "share-bold",
    });

    const user = await findOne(discordId);
    const canvas = Canvas.createCanvas(1700, 550);
    const context = canvas.getContext("2d");

    // background
    const bg1 = await Canvas.loadImage("./assets/images/bf6-bg-1.png");
    const bg2 = await Canvas.loadImage("./assets/images/bf6-bg-2.png");
    const bg3 = await Canvas.loadImage("./assets/images/bf6-bg-3.png");
    const bg4 = await Canvas.loadImage("./assets/images/bf6-bg-4.png");
    const bg5 = await Canvas.loadImage("./assets/images/bf6-bg-5.png");
    const bg6 = await Canvas.loadImage("./assets/images/bf6-bg-6.png");
    const bg7 = await Canvas.loadImage("./assets/images/bf6-bg-7.png");
    const bg8 = await Canvas.loadImage("./assets/images/bf6-bg-8.png");
    function pickRandomBg() {
      const randomBg = Math.floor(Math.random() * 8);
      if (randomBg === 0) {
        return bg1;
      } else if (randomBg === 1) {
        return bg2;
      } else if (randomBg === 2) {
        return bg3;
      } else if (randomBg === 3) {
        return bg4;
      } else if (randomBg === 4) {
        return bg5;
      } else if (randomBg === 5) {
        return bg6;
      } else if (randomBg === 6) {
        return bg7;
      } else if (randomBg === 7) {
        return bg8;
      }
    }

    context.drawImage(pickRandomBg(), 0, 0, canvas.width, canvas.height);

    // avatar
    try {
      const avatar = await Canvas.loadImage("https://picsum.photos/200/300");
      context.drawImage(avatar, 43, 43, 210, 215);
    } catch (error) {
      console.log(error);
    }

    // const avatarFrame = await Canvas.loadImage("./assets/images/frame-new.png");
    // const sparkles = await Canvas.loadImage("./assets/images/sparkles-new.png");
    const shiny = await Canvas.loadImage("./assets/images/flares.png");
    // const moreShiny = await Canvas.loadImage("./assets/images/more-shiny.png");

    // sparkles
    // context.globalCompositeOperation = "lighter";
    // if (user.skills > requiredPoints / 2) {
    //   context.drawImage(sparkles, 20, 220, 800, 200);
    // }
    // if (user.contribution > requiredPoints / 2) {
    //   context.drawImage(sparkles, 20, 290, 800, 200);
    // }
    // if (user.personality > requiredPoints / 2) {
    //   context.drawImage(sparkles, 20, 360, 800, 200);
    // }

    if (user.skills >= requiredPoints) {
      context.drawImage(shiny, canvas.width / 2 - 185, 60);
      // context.drawImage(moreShiny, canvas.width / 2 + 90, 300);
    }
    if (user.contribution >= requiredPoints) {
      context.drawImage(shiny, canvas.width / 2 - 185, 130);
      // context.drawImage(moreShiny, canvas.width / 2 - 50, 390);
    }
    if (user.personality >= requiredPoints) {
      context.drawImage(shiny, canvas.width / 2 - 185, 200);
      // context.drawImage(moreShiny, canvas.width / 2 - 50, 460);
    }

    // avatar frame
    const frameX = 41;
    const frameY = 41;
    const frameWidth = 215;
    const frameHeight = 215;

    context.strokeStyle = "#ffffff"; // white border
    context.lineWidth = 4; // thicker border
    context.lineJoin = "round"; // rounded corners
    context.strokeRect(frameX, frameY, frameWidth, frameHeight);

    // num boxes
    drawNumBox(
      context,
      canvas.width / 2 + 280,
      315,
      50,
      48,
      user.skills >= requiredPoints,
      user.skills,
      context
    );
    drawNumBox(
      context,
      canvas.width / 2 + 280,
      385,
      50,
      48,
      user.contribution >= requiredPoints,
      user.contribution,
      context
    );
    drawNumBox(
      context,
      canvas.width / 2 + 280,
      455,
      50,
      48,
      user.personality >= requiredPoints,
      user.personality,
      context
    );

    // skill
    drawProgressBar(280, 330, user.skills, context, requiredPoints, canvas);
    // contribution
    drawProgressBar(
      280,
      400,
      user.contribution,
      context,
      requiredPoints,
      canvas
    );
    // personality
    drawProgressBar(
      280,
      470,
      user.personality,
      context,
      requiredPoints,
      canvas
    );

    // context.strokeRect(0, 0, canvas.width, canvas.height);

    // reset composite op
    context.globalCompositeOperation = "source-over";

    // text
    context.font = "64px share-bold";
    context.fillStyle = "#ffffff";
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    context.fillText(name.toUpperCase(), 288, canvas.height / 4.0);

    context.font = "32px share-bold";
    context.fillStyle = "#ffffff";
    context.fillText("SKILL", 40, 345);
    context.fillText("CONTRIBUTION", 40, 415);
    context.fillText("PERSONALITY", 40, 485);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "profile-image.png",
    });
    return attachment;
  } catch (error) {
    console.log("errr");
    console.log(error);
  }
};
