import { ModalBuilder, TextInputBuilder } from "discord.js";

export const linkAnotherAccountModal = () => {
  return new ModalBuilder() // We create a Modal
    .setCustomId("linkAnotherAccount")
    .setTitle("Member Registration")
    .addComponents(
      new TextInputBuilder() // We create a Text Input Component
        .setCustomId("gameNameVal")
        .setLabel("Ingame nickname")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setRequired(true), // If it's required or not

      new TextInputBuilder() // We create a Text Input Component
        .setCustomId("platformVal")
        .setLabel("platform (pc,xboxone,ps4,ps3,xbox360)")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setRequired(true), // If it's required or not
      new TextInputBuilder() // We create a Text Input Component
        .setCustomId("gameVal")
        .setLabel("game (bf1,bfv,bf3,bf4,bf2042)")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setRequired(true) // If it's required or not
      //   new SelectMenuComponent()
      //     .setCustomId("platformVal")
      //     .setPlaceholder("Please select a platform")
      //     .addOptions(
      //       {
      //         label: "PC",
      //         value: "pc",
      //       },
      //       {
      //         label: "XBOX ONE",
      //         value: "xboxone",
      //       },
      //       {
      //         label: "PS4",
      //         value: "ps4",
      //       },
      //       {
      //         label: "PS3",
      //         value: "ps3",
      //       },
      //       {
      //         label: "XBOX 360",
      //         value: "xbox360",
      //       }
      //     ),

      //   new SelectMenuComponent()
      //     .setCustomId("gameVal")
      //     .setPlaceholder("Please select a game")
      //     .addOptions(
      //       {
      //         label: "BF1",
      //         description: "Battlefield 1",
      //         value: "bf1",
      //       },
      //       {
      //         label: "BFV",
      //         description: "Battlefield V",
      //         value: "bfv",
      //       },
      //       {
      //         label: "BF3",
      //         description: "Battlefield 3",
      //         value: "bf3",
      //       },
      //       {
      //         label: "BF4",
      //         description: "Battlefield 4",
      //         value: "bf4",
      //       }
      //     )
    );
};
