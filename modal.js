import { showModal } from "discord-modals"; // Now we extract the showModal method
import {
  createMember,
  findOne,
  findOneByName,
} from "./services/memberService.js";
import axios from "axios";
import { getVoteEmbed } from "./UI/embeds/voteEmbed.js";
import { getPlate } from "./UI/userPlate.js";
import { getSearchModal } from "./UI/searchModal.js";
import { getRegisterModal } from "./UI/registerModal.js";
import {
  CONTRIBUTION_EMOJI,
  NO_EMOJI,
  PERSONALITY_EMOJI,
  SKILL_EMOJI,
  YES_EMOJI,
} from "./emojies/emojies.js";
import { getButton } from "./UI/button.js";
import { MessageButton } from "discord.js";

export const getModal = (client) => {
  let interactionType;

  client.on("interactionCreate", async (interaction) => {
    if (interaction.customId === "registerButton") {
      interactionType = "register";
      if (await findOne(interaction.member.id)) {
        const botReply = await interaction.reply(
          "You are already registered one to link another account?"
        );
        botReply.react(YES_EMOJI);
        botReply.react(NO_EMOJI);
      } else
        showModal(getRegisterModal(), {
          client: client, // Client to show the Modal through the Discord API.
          interaction: interaction, // Show the modal with interaction data.
        });
    } else if (interaction.customId === "voteButton") {
      interactionType = "vote";
      showModal(getSearchModal(), {
        client: client, // Client to show the Modal through the Discord API.
        interaction: interaction, // Show the modal with interaction data.
      });
    }
  });
  client.on("modalSubmit", async (modal, data) => {
    const gameNameVal = modal.getTextInputValue("gameNameVal");
    const platformVal = modal.getTextInputValue("platformVal");
    const gameVal = modal.getTextInputValue("gameVal");

    //if its for voting we dont want to create a user
    if (interactionType === "register") {
      axios
        .get(
          `https://api.gametools.network/${gameVal}/all/?format_values=false&name=${gameNameVal}&lang=en-us&platform=${platformVal}`
        )
        .then(async (returnedMember) => {
          //check if the user's profile exists
          // we got a problem here, names are case sensitive
          if (returnedMember?.data?.id) {
            //if the user's profile exists , then we create a new member in the db

            createMember(
              modal.user.id,
              returnedMember.data.id,
              "pc",
              returnedMember.data.platoons
                .map((el) => el.id)
                //this is idf platoon id, hardcoded for now
                .includes("fbc7c5ab-c125-41f9-be8c-f367c03b2551"),

              modal.user.username,
              returnedMember.data.userName,
              returnedMember.data.avatar
            );
            // assign registered role

            // addes a role when user is registered, hardcoded for now

            modal.member.roles.add("968118833187545088");

            await modal.deferReply({ ephemeral: true });
            modal.followUp({
              content: "response collected",

              ephemeral: true,
            });
          } else {
            await modal.deferReply({ ephemeral: true });
            modal.followUp({
              content: "User not found",

              ephemeral: true,
            });
          }
        });
    } else if (interactionType === "vote") {
      // search by game name, maybe if we can use discord Id would be great.

      const usernameVal = modal.getTextInputValue("usernameVal");
      const user = await findOneByName(usernameVal);
      if (!user) {
        await modal.deferReply({ ephemeral: true });
        return modal.followUp("User not found");
      }

      //TODO : how can I get the user avatar from discord?

      // I could have just passed the whole user object here instead of passing discord id and fetching it again
      // in the plate, but idk why I did that ...
      const attachment = await getPlate(
        user.userNames[0],
        user.discordId,
        user.avatar
      );
      //TODO: send a error message when user doesnt exist

      // big problem here, if ephemeral is true, we cannot react to the messag
      await modal.deferReply({ ephemeral: true });
      const message = await modal.followUp({
        embeds: [getVoteEmbed(user.userNames[0], user.discordId)],
        ephemeral: true,
        files: [attachment],
        components: [
          getButton([
            new MessageButton()
              .setCustomId("skillsId")
              .setLabel("Skills")
              .setStyle("DANGER"),
            new MessageButton()
              .setCustomId("contributionId")
              .setLabel("contribution")
              .setStyle("SUCCESS"),
            new MessageButton()
              .setCustomId("personalityId")
              .setLabel("personality")
              .setStyle("PRIMARY"),
          ]),
        ],
      });
      // Promise.all([
      //   message.react(SKILL_EMOJI),
      //   message.react(CONTRIBUTION_EMOJI),
      //   message.react(PERSONALITY_EMOJI),
      // ]).catch((error) =>
      //   console.error("One of the emojis failed to react:", error)
      // );
    }
  });

  client.on("messageReactionAdd", async (reaction, user) => {
    const dbUser = await findOne(user.id);

    // we check so we dont add the bots votes
    if (dbUser) {
      // not the bot
      if (user.username !== "tag") {
        if (reaction.emoji.name === SKILL_EMOJI) {
          dbUser.skills += 1;
        } else if (reaction.emoji.name === CONTRIBUTION_EMOJI) {
          dbUser.contribution += 1;
        } else if (reaction.emoji.name === PERSONALITY_EMOJI) {
          dbUser.personality += 1;
        }
      }

      await dbUser.save();
    }
  });
};
