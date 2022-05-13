import express from "express";
import env from "dotenv";
import { Client, Intents, MessageButton } from "discord.js";

import memberRoutes from "./routes/memberRoutes.js";
import discordModals from "discord-modals";
import { getModal } from "./modal.js";
import { tagEmbed } from "./UI/embeds/messageEmbed.js";
import { getPlate } from "./UI/userPlate.js";
import { findOne } from "./services/memberService.js";
import { getButton } from "./UI/button.js";
import { questionsEmbed } from "./UI/embeds/questionsEmbed.js";

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

  const message = await channel.send({
    embeds: [tagEmbed],
    components: [
      getButton([
        new MessageButton()
          .setCustomId("registerButton")
          .setLabel("Register")
          .setStyle("SUCCESS"),
      ]),
    ],
  });
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
});
discordModals(client);

getModal(client);

client.on("messageCreate", async (msg) => {
  //we dont want messages from the bot

  if (msg.author.bot) return;

  // in case you are very bored
  if (msg.content.toLowerCase() === "ping") {
    msg.reply("pong");
  }
  if (msg.content.toLowerCase() === "!makechannel") {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const role = guild.roles.cache.find((role) => {
      return role.name === "@everyone";
    });
    const mods = guild.roles.cache.find((role) => {
      return role.name === "mod";
    });

    const newChannel = await guild.channels.create("submit a ticket", {
      parent: "974645473187098654",
      permissionOverwrites: [
        {
          id: role.id,
          deny: ["VIEW_CHANNEL"],
        },
        {
          id: msg.member.id,
          allow: ["VIEW_CHANNEL"],
        },
        {
          id: mods.id,
          allow: ["ADMINISTRATOR"],
        },
      ],
    });
    newChannel.send({ embeds: [questionsEmbed] });
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

export default app;
