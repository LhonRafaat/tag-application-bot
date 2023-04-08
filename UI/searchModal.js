import { ModalBuilder } from "@discordjs/builders";
import { TextInputComponent } from "discord.js";
export const getSearchModal = () => {
  return new ModalBuilder() // We create a Modal
    .setCustomId("searchModal")
    .setTitle("Search For A User")
    .addComponents(
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("usernameVal")
        .setLabel("Enter user's name")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setPlaceholder("type here ..")
        .setRequired(true) // If it's required or not
    );
};
