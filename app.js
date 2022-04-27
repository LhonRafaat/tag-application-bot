import express from "express";
import env from "dotenv";
import { Client, Intents, MessageActionRow, MessageButton } from "discord.js";

import memberRoutes from "./routes/memberRoutes.js";
import { createMember, findOne } from "./services/memberService.js";
import axios from "axios";
import discordModals from "discord-modals";
import { getModal } from "./modal.js";
import { tagEmbed } from "./messageEmbed.js";

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
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["USER", "REACTION", "MESSAGE"],
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("connected the bot"))
  .catch((err) => console.log(err));

client.on("ready", async () => {
  const channel = client.channels.cache.get("968131185668665404");
  channel.bulkDelete(100);

  //TODO move the button to its own file
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("search")
      .setLabel("Search for a user")
      .setStyle("PRIMARY")
  );

  const message = await channel.send({ embeds: [tagEmbed], components: [row] });
  message.pin();

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

// client.on("clickButton", (button) => {
//   console.log("button");
//   if (button.id === "vote") {
//     console.log("vote");
//   }
// });

client.on("messageCreate", async (msg) => {
  //we dont want messages from the bot

  if (msg.author.bot) return;

  // in case you are very bored
  if (msg.content.toLowerCase() === "ping") {
    msg.reply("pong");
  }
});

export default app;
