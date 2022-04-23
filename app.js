import express from "express";
import env from "dotenv";
import { Client, Intents } from "discord.js";

import memberRoutes from "./routes/memberRoutes.js";
import { createMember, findOne } from "./services/memberService.js";
import axios from "axios";

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

client.on("messageCreate", async (msg) => {
  //we dont want messages from the bot

  if (msg.author.bot) return;

  // check to see if we already have this user in db
  const user = await findOne(msg.author.id);
  console.log(user);

  // if we did not have the user , then we get to work
  if (!user) {
    // these console logs are only for debugging , dont worry

    console.log("here");

    //making a http request to gametools api to find the user profile, but idk what to do about the game and platform , beacause they are required
    // meaning a game and platform is always chosen which ofcourse is a issue.

    const member = axios
      .get(
        `https://api.gametools.network/bfv/all/?format_values=false&name=${msg.member.nickname}&lang=en-us&platform=pc&`
      )
      .then((returnedMember) => {
        console.log(returnedMember.data);

        //check if the user's profile exists
        if (returnedMember?.data?.id) {
          console.log("here2");

          //if the user's profile exists , then we create a new member in the db

          createMember(
            msg.author.id,
            returnedMember.data.id,
            "pc",
            returnedMember.data.platoons
              .map((el) => el.id)
              .includes("fbc7c5ab-c125-41f9-be8c-f367c03b2551"),
            msg.author.username
          );
        }
      });
  }
  // in case you are very bored
  if (msg.content.toLowerCase() === "ping") {
    msg.reply("pong");
  }
});

export default app;
