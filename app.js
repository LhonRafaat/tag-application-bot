import express from "express";
import env from "dotenv";
import { Client, Intents } from "discord.js";

import memberRoutes from "./routes/memberRoutes.js";
import { findOne } from "./services/memberService.js";

env.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(memberRoutes);

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("connected the bot"))
  .catch((err) => console.log(err));

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  console.log(msg.client.user.id);
  const user = findOne(msg.client.user.id);
  if(!user)
  if (msg.content.toLowerCase() === "ping") {
    msg.reply("pong");
  }
});

export default app;
