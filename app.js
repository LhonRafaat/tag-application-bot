import express from "express";
import env from "dotenv";
import { Client, Intents } from "discord.js";

import memberRoutes from "./routes/memberRoutes.js";
import { createMember, findOne } from "./services/memberService.js";
import axios from "axios";
import discordModals from "discord-modals";
import { getModal } from "./modal.js";

env.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(memberRoutes);

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
  ],
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("connected the bot"))
  .catch((err) => console.log(err));

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  let commands;
  if (guild) {
    commands = guild.commands;
  } else {
    commands = client?.application.commands;
  }
  commands?.create({
    name: "modal",
    description: "tag Modal",
  });
});
discordModals(client);

getModal(client);

// client.on("interactionCreate", async (interaction) => {});
client.on("messageCreate", async (msg) => {
  //we dont want messages from the bot

  if (msg.author.bot) return;

  // check to see if we already have this user in db
  // const user = await findOne(msg.author.id);

  // if we did not have the user , then we get to work
  // if (!user) {
  //   // these console logs are only for debugging , dont worry
  //   //making a http request to gametools api to find the user profile, but idk what to do about the game and platform , beacause they are required
  //   // meaning a game and platform is always chosen which ofcourse is a issue.
  // }
  // in case you are very bored
  if (msg.content.toLowerCase() === "ping") {
    msg.reply("pong");
  }
});

export default app;
