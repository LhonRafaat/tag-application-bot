import { Modal, TextInputComponent, showModal } from "discord-modals"; // Now we extract the showModal method
import { createMember, findOne } from "./services/memberService.js";
import axios from "axios";

export const getModal = (client) => {
  const modal = new Modal() // We create a Modal
    .setCustomId("modal-customid")
    .setTitle("Test of Discord-Modals!")
    .addComponents(
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("textinput-customid")
        .setLabel("Some text Here")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setMinLength(4)
        .setMaxLength(10)
        .setPlaceholder("Write a text here")
        .setRequired(true) // If it's required or not
    );

  client.on("interactionCreate", async (interaction) => {
    console.log("here");
    // Let's say the interaction will be a Slash Command called 'ping'.
    if (interaction.commandName === "modal") {
      if (await findOne(interaction.member.id))
        interaction.reply("You are already in the database");
      else
        showModal(modal, {
          client: client, // Client to show the Modal through the Discord API.
          interaction: interaction, // Show the modal with interaction data.
        });
    }
  });
  client.on("modalSubmit", async (modal, data) => {
    console.log(modal);
    if (modal.customId === "modal-customid") {
      const gameId = modal.getTextInputValue("textinput-customid");

      axios
        .get(
          `https://api.gametools.network/bfv/all/?format_values=false&name=${gameId}&lang=en-us&platform=pc&`
        )
        .then((returnedMember) => {
          //check if the user's profile exists
          if (returnedMember?.data?.id) {
            //if the user's profile exists , then we create a new member in the db

            createMember(
              modal.user.id,
              returnedMember.data.id,
              "pc",
              returnedMember.data.platoons
                .map((el) => el.id)
                .includes("fbc7c5ab-c125-41f9-be8c-f367c03b2551"),
              modal.user.username
            );
          }
        });

      await modal.deferReply({ ephemeral: true });
      modal.followUp({
        content: "response collected",

        ephemeral: true,
      });
    }
  });
};
