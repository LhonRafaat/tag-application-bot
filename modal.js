import { Modal, TextInputComponent, showModal } from "discord-modals"; // Now we extract the showModal method
import { createMember, findOne } from "./services/memberService.js";
import axios from "axios";
import { voteEmbed } from "./voteEmbed.js";
import { getPlate } from "./UI/userPlate.js";
import { getSearchModal } from "./UI/searchModal.js";
import { getRegisterModal } from "./UI/registerModal.js";
import { NO_EMOJI, YES_EMOJI } from "./emojies/emojies.js";

export const getModal = (client) => {
  let interactionType;

  client.on("interactionCreate", async (interaction) => {
    if (interaction.commandName === "register") {
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
    } else if (interaction.customId === "search") {
      interactionType = "vote";
      showModal(getSearchModal(), {
        client: client, // Client to show the Modal through the Discord API.
        interaction: interaction, // Show the modal with interaction data.
      });
    }
  });
  client.on("modalSubmit", async (modal, data) => {
    if (modal.customId === "registerModal") {
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
                returnedMember.data.userName
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

        const attachment = await getPlate(
          modal.member.displayName,
          modal.user.id,
          modal.member.displayAvatarURL({ format: "jpg" })
        );
        //TODO: send a error message when user doesnt exist
        await modal.deferReply({ ephemeral: false });
        const message = await modal.followUp({
          // content: `name : ${member.fullName}
          //           originId: ${member.originId}
          //           platforms: ${member.platforms}

          // `,

          embeds: [voteEmbed],
          ephemeral: true,
          files: [attachment],
        });
        Promise.all([
          message.react("🍎"),
          message.react("🍊"),
          message.react("🍇"),
        ]).catch((error) =>
          console.error("One of the emojis failed to react:", error)
        );
      }
    }
  });

  client.on("messageReactionAdd", async (reaction, user) => {
    const dbUser = await findOne(user.id);

    // we check so we dont add the bots votes
    if (dbUser) {
      if (user.username !== "tag") {
        if (reaction.emoji.name === "🍎") {
          dbUser.skills += 1;
        } else if (reaction.emoji.name === "🍊") {
          dbUser.contribution += 1;
        } else if (reaction.emoji.name === "🍇") {
          dbUser.personality += 1;
        }
      }

      await dbUser.save();
    }
  });
};
