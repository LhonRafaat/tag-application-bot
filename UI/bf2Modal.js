import { ModalBuilder } from "@discordjs/builders";
import { TextInputBuilder, TextInputStyle } from "discord.js";

export const getBf2Modal = () => {
  return new ModalBuilder() // We create a Modal
    .setCustomId("bf2Modal")
    .setTitle("Register your BF2 account")
    .addComponents(
      new TextInputBuilder() // We create a Text Input Component
        .setCustomId("bf2NameVal")
        .setLabel("Ingame nickname")
        .setStyle(TextInputStyle.Short) //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
    );
};
