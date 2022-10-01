import Canvas from "canvas";
import { MessageAttachment } from "discord.js";

export const getTournamentPlate = async () => {
  const sampleUsers = [
    {
      name: "John Doe",
      points: 100,
    },

    {
      name: "Jane Doe",
      points: 200,
    },
    {
      name: "John Don",
      points: 300,
    },
    {
      name: "Jane Don",
      points: 400,
    },
    {
      name: "Jane Don",
      points: 400,
    },
    {
      name: "Jane Don",
      points: 400,
    },
    {
      name: "Jane Don",
      points: 400,
    },
    {
      name: "Jane Don",
      points: 400,
    },
    {
      name: "Jane Don",
      points: 400,
    },
    {
      name: "Jane Don",
      points: 400,
    },
  ];
  Canvas.registerFont("./assets/fonts/share-regular.ttf", {
    family: "share-regular",
  });
  Canvas.registerFont("./assets/fonts/share-bold.ttf", {
    family: "share-bold",
  });

  const canvas = Canvas.createCanvas(5000, 2000 + sampleUsers.length * 100);
  const context = canvas.getContext("2d");
  // order is acting like z-index here
  const background = await Canvas.loadImage("./assets/images/bf-bg.png");

  // This uses the canvas dimensions to stretch the image onto the entire canvas
  context.drawImage(background, 0, 0, canvas.width, canvas.height);
  context.globalAlpha = 0.5;
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalAlpha = 1;
  context.font = "100px share-regular";
  context.fillStyle = "gray";
  context.fillText(
    "BFV pacific tournament",
    canvas.width - canvas.width / 1.6,
    canvas.height / 7
  );

  context.beginPath();
  context.rect(100, 100, canvas.width - 200, canvas.height - 200);
  context.fillStyle = "white";
  context.strokeStyle = "white";
  context.stroke();
  //user row
  sampleUsers
    .sort((a, b) => {
      if (a.points > b.points) {
        return -1;
      }
      if (a.points < b.points) {
        return 1;
      }
      return 0; 
    })
    .forEach((user, index) => {
      let y = 500;
      for (let i = 0; i < index; i++) {
        y += 210;
      }
      context.globalAlpha = 0.2;
      context.fillStyle = "gray";
      context.fillRect(200, y, canvas.width - 400, 200);
      context.globalAlpha = 1;
      context.fillStyle = "gray";
      context.fillText(user.name, 350, y + 120);
      context.fillText(index + 1, 240, y + 120);
      context.fillStyle = "white";
      context.fillText(user.points, canvas.width - 350, y + 120);
      context.fillStyle = "red";
      context.globalAlpha = 0.2;
      context.fillRect(210, y + 45, 100, 100);
      context.globalAlpha = 1;
    });

  // Use the helpful Attachment class structure to process the file for you
  const attachment = new MessageAttachment(
    canvas.toBuffer(),
    "profile-image.png"
  );

  return attachment;
};
