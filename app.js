import express from "express";
import env from "dotenv";
import { Client, Intents, MessageButton } from "discord.js";
import cors from "cors";
import memberRoutes from "./routes/memberRoutes.js";
import settingsRoute from "./routes/settingsRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import discordModals from "discord-modals";
import { getModal } from "./modal.js";
import { getPlate } from "./UI/userPlate.js";
import { findOne } from "./services/memberService.js";
import { getButton } from "./UI/button.js";
import { getSettings } from "./services/settingService.js";
import jwt from "jsonwebtoken";
import { loginCont } from "./controllers/adminController.js";

env.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["USER", "REACTION", "MESSAGE"],
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("connected the bot"))
  .catch((err) => console.log(err));

client.on("ready", async () => {
  const settings = await getSettings();
  if (settings.length === 0) return;
  try {
    const channel = client.channels.cache.get(settings[0].votingChannelId);
    channel.messages.fetch({ limit: 100 }).then((messages) => {
      console.log(`Received ${messages.size} messages`);
      //Iterate through the messages here with the variable "messages".
      messages.forEach((message) => {
        //TODO: Add the bot id to settings schema
        if (message.author.id === settings[0].botId) {
          message.delete();
        }
      });
    });
    // channel.bulkDelete(100);

    //TODO move the button to its own file

    await channel.send({
      components: [
        getButton([
          new MessageButton()
            .setCustomId("registerButton")
            .setLabel("Register")
            .setStyle("SUCCESS"),
        ]),
      ],
    });
  } catch (error) {
    return;
  }

  // message.pin();

  console.log(`Logged in as ${client.user.tag}!`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID + "22");
  let commands;
  if (guild) {
    commands = guild.commands;
  } else {
    commands = client?.application.commands;
  }
  commands?.create({
    name: "vote",
    description: "vote for user",
    options: [
      {
        name: "username",
        required: true,
        description: "username of the user to vote for",
        type: "USER",
      },
    ],
  });
  commands?.create({
    name: "getstatus",
    description: "get user status plate",
    options: [
      {
        name: "username",
        required: true,
        description: "username of the user to get the status",
        type: "USER",
      },
    ],
  });
  commands?.create({
    name: "getregister",
    description: "get register button",
  });
  commands?.create({
    name: "getbygamename",
    description: "get user status plate",
    options: [
      {
        name: "username",
        required: true,
        description: "username of the user to get the status",
        type: "STRING",
      },
    ],
  });
  commands?.create({
    name: "setpoints",
    description: "set required points",
    options: [
      {
        name: "points",
        required: true,
        description: "enter the required points",
        type: "NUMBER",
      },
    ],
  });
  commands?.create({
    name: "requiredpoints",
    description: "preview required points",
  });
  commands?.create({
    name: "closeticket",
    description: "delete current channel",
  });
});
discordModals(client);

getModal(client);

client.on("messageCreate", async (msg) => {
  const settings = await getSettings();
  if (settings.length === 0) return;

  //we dont want messages from the bot

  if (msg.author.bot) return;

  // in case you are very bored
  if (msg.content.toLowerCase() === "who is the best pilot in the universe") {
    msg.reply("LhonXD");
  }

  if (msg.content.toLowerCase() === "!myvotes") {
    const user = await findOne(msg.author.id);
    if (!user) return msg.reply("you are not registered");
    const plate = await getPlate(
      // taking the first username, maybe we increase it  ?
      user.userNames[0],
      user.discordId,
      user.avatar,
      user.userNames[1] ? user.userNames[1] : undefined
    );
    return msg.reply({ files: [plate] });
  }
});

app.use("/api/auth/login", loginCont);
app.use((req, res, next) => {
  try {
    jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    //check for token
  } catch (error) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  }

  next();
});

app.use(memberRoutes);
app.use(settingsRoute);
app.use(adminRoutes);
app.use("*", (req, res) => {
  return res.status(404).json({
    msg: "Not found",
  });
});

export default app;
