import Canvas from "canvas";
import { AttachmentBuilder } from "discord.js";

export const generateMemberTable = async (members) => {
  const canvasWidth = 2500;
  const rowHeight = 100;
  const canvasHeight = 15 * rowHeight + 400;
  const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext("2d");

  // Fill background with plain orange
  context.fillStyle = "#FE3A00";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // === Draw jet on left side ===
  try {
    const jetImage = await Canvas.loadImage("./assets/images/jet.png");

    // 🔹 Increase size (try 1100x1400 for a more dominant look)
    const jetWidth = 1200;
    const jetHeight = 1500;

    // 🔹 Position it slightly more to the left and centered vertically
    const jetX = -150;
    const jetY = (canvas.height - jetHeight) / 2;

    // 🔹 Make it less transparent (0.8 = strong visibility, 1 = solid)
    context.globalAlpha = 0.8;

    context.drawImage(jetImage, jetX, jetY, jetWidth, jetHeight);

    // Reset alpha after drawing
    context.globalAlpha = 1;
  } catch (error) {
    console.error("Error loading jet image:", error);
  }

  // Create blurred overlay for glass-like table background
  const tableWidth = 1400;
  const tableHeight = 15 * rowHeight + 150;
  const tableX = (canvas.width - tableWidth) / 2; // center horizontally
  const tableY = 150;

  // Draw blurred background for the table
  context.save();
  context.filter = "blur(20px)";
  context.fillStyle = "rgba(255, 255, 255, 0.1)";
  context.fillRect(tableX - 20, tableY - 20, tableWidth + 40, tableHeight + 60);
  context.restore();

  // Draw semi-transparent black panel over it (glass effect)
  context.fillStyle = "rgba(0, 0, 0, 0.4)";
  context.fillRect(tableX, tableY, tableWidth, tableHeight + 20);

  // Register fonts
  Canvas.registerFont("./assets/fonts/share-regular.ttf", {
    family: "share-regular",
  });
  Canvas.registerFont("./assets/fonts/share-bold.ttf", {
    family: "share-bold",
  });

  // === Draw bottom-right logo ===
  try {
    // make the object composition over
    context.globalCompositeOperation = "source-over";

    const cornerLogo = await Canvas.loadImage("./assets/images/idf-bold.svg");

    const logoSize = 90; // make it a bit bigger for bottom corner
    const margin = 40; // spacing from edges

    const logoX = canvas.width - logoSize - margin;
    const logoY = canvas.height - logoSize - margin;

    context.globalAlpha = 0.8; // slightly transparent if you want
    context.drawImage(cornerLogo, logoX, logoY, logoSize, logoSize);
    context.globalAlpha = 1; // reset alpha
  } catch (error) {
    console.error("Error loading corner logo:", error);
  }

  // === HEADER BAR (logo + text) ===
  try {
    const logo = await Canvas.loadImage("./assets/images/idf-header-logo.png"); // <- replace with your logo path
    const headerHeight = 80;
    const headerWidth = 750;
    const headerX = (canvas.width - headerWidth) / 2;
    const headerY = tableY - headerHeight - 10;

    // Header background
    context.fillStyle = "#FFFFFF";
    context.fillRect(headerX, headerY, headerWidth, headerHeight);

    // Draw logo
    const logoSize = 50;
    context.drawImage(logo, headerX + 30, headerY + 15, logoSize, logoSize);

    // Draw title text
    context.fillStyle = "#000000";
    context.font = "bold 56px share-bold";
    context.fillText("COMMUNITY RANKING", headerX + 100, headerY + 58);
  } catch (error) {
    console.error("Error loading header logo:", error);
  }

  context.font = "32px share-regular";
  const headerColor = "#FFFFFF";
  const textColor = "#E3E3E3";

  const columnPositions = {
    rank: tableX + 100,
    name: tableX + 300,
    username: tableX + 700,
    points: tableX + 1100,
  };

  // Draw header
  context.fillStyle = headerColor;
  context.fillText("RANK", columnPositions.rank, tableY + 50);
  context.fillText("NAME", columnPositions.name, tableY + 50);
  context.fillText("USERNAME", columnPositions.username, tableY + 50);
  context.fillText("POINTS", columnPositions.points, tableY + 50);

  context.font = "32px share-bold";

  // Draw each row
  for (let i = 0; i < 16; i++) {
    const member = members[0];
    const y = tableY + 120 + i * rowHeight;

    // === Alternate row color (slight transparency) ===
    if (i === 0) {
      context.fillStyle = "rgba(255, 255, 255, 0.25)"; // lightest for first row
    } else if (i === 1) {
      context.fillStyle = "rgba(255, 255, 255, 0.18)"; // slightly darker for second row
    } else if (i === 2) {
      context.fillStyle = "rgba(255, 255, 255, 0.10)"; // even darker for third row
    } else {
      context.fillStyle = "rgba(255, 255, 255, 0.04)"; // default for the rest
    }
    context.fillRect(tableX + 20, y - 40, tableWidth - 40, rowHeight - 10);

    // === Draw background for rank column ===
    const rankWidth = 60; // width of rank box
    const rankHeight = rowHeight - 50;
    const rankX = columnPositions.rank - 20;
    const rankY = y - rankHeight / 2;

    if (i === 0) {
      context.fillStyle = "#FFD700"; // gold
    } else if (i === 1) {
      context.fillStyle = "#C0C0C0"; // silver
    } else if (i === 2) {
      context.fillStyle = "#CD7F32"; // bronze
    } else {
      context.fillStyle = "#FFFFFF"; // white for the rest
    }
    context.fillRect(rankX, rankY, rankWidth, rankHeight);

    // === Draw centered rank text ===
    const rankNumber = (i + 1).toString();
    const textMetrics = context.measureText(rankNumber);
    const textWidth = textMetrics.width;
    const textX = rankX + rankWidth / 2 - textWidth / 2;
    const textY = y + 10; // adjust if needed

    context.fillStyle = "#000000"; // black for top 3
    context.fillText(rankNumber, textX, textY);

    // === Draw other text ===
    context.fillStyle = textColor;
    context.fillText(member.name, columnPositions.name, y);
    context.fillText(member.username, columnPositions.username, y);

    // === Draw black background for points ===
    const pointsWidth = 130;
    const pointsHeight = rowHeight - 40;
    const pointsX = columnPositions.points - 20;
    const pointsY = y - pointsHeight / 2;

    context.fillStyle = "#000000";
    context.fillRect(pointsX, pointsY, pointsWidth, pointsHeight);

    // === Draw points text ===
    const pointsText = member.totalPoints.toString();
    const pointsMetrics = context.measureText(pointsText);
    const pointsTextWidth = pointsMetrics.width;
    const pointsTextX = pointsX + pointsWidth / 2 - pointsTextWidth / 2;
    const pointsTextY = y + 10;

    context.fillStyle = "#FFFFFF";
    context.fillText(pointsText, pointsTextX, pointsTextY);
  }

  // Create image attachment
  const attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: "member-table.png",
  });
  return attachment;
};
