import Canvas from "canvas";
import { AttachmentBuilder } from "discord.js";

export const generateMemberTable = async (members) => {
  // Canvas setup: increased width by 300px
  const canvas = Canvas.createCanvas(1800, members.length * 100 + 200);
  const context = canvas.getContext("2d");

  // Load and draw the background image
  const background = await Canvas.loadImage("./assets/images/bf-bg.png");
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Fonts and styles
  Canvas.registerFont("./assets/fonts/share-regular.ttf", {
    family: "share-regular",
  });
  Canvas.registerFont("./assets/fonts/share-bold.ttf", {
    family: "share-bold",
  });
  context.font = "32px share-bold";
  const headerColor = "#FFFFFF"; // White color for headers
  const textColor = "#67FFFF"; // Text color for content

  // Table header
  context.fillStyle = headerColor;
  context.fillText("Avatar", 100, 50);
  context.fillText("Name", 400, 50);
  context.fillText("Username", 700, 50);
  context.fillText("Total Points", 1000, 50);

  // Loop through each member
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    const yPosition = 150 + i * 100; // Added more space between header and data

    // Draw avatar rectangle
    context.strokeStyle = textColor;
    context.lineWidth = 2;
    context.strokeRect(100, yPosition - 40, 80, 80);

    // Draw avatar
    try {
      const avatar = await Canvas.loadImage(member.avatar);
      context.drawImage(avatar, 100, yPosition - 40, 80, 80);
    } catch (error) {
      console.log(error);
    }

    // Draw index, name, username, and points
    context.fillStyle = textColor;
    context.fillText((i + 1).toString() + ".           ", 50, yPosition); // Index
    context.fillText(member.name, 400, yPosition); // Name
    context.fillText(member.username, 700, yPosition); // Username
    context.fillText(member.totalPoints.toString(), 1000, yPosition); // Total Points
  }

  // Create attachment
  const attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: "member-table.png",
  });

  return attachment;
};
