import { ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const getRegisterModal = () => {
  return new ModalBuilder()
    .setCustomId("registerModal")
    .setTitle("Member Registration")
    .addComponents(
      new TextInputBuilder()
        .setCustomId("gameNameVal")
        .setLabel("Ingame nickname")
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
      new TextInputBuilder()
        .setCustomId("platformVal")
        .setLabel("platform (pc,xboxone,ps4,ps3,xbox360)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
      new TextInputBuilder()
        .setCustomId("gameVal")
        .setLabel("game (bf1,bfv,bf3,bf4,bf2042)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
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
