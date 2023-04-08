import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export const linkAnotherAccountModal = () => {
  const modal = new ModalBuilder() // We create a Modal
    .setCustomId("linkAnotherAccount")
    .setTitle("Member Registration");
  const gameNameVal = new TextInputBuilder()
    .setCustomId("gameNameVal")
    .setLabel("Ingame nickname")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const platformVal = new TextInputBuilder()
    .setCustomId("platformVal")
    .setLabel("platform (pc,xboxone,ps4,ps3,xbox360)")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const gameVal = new TextInputBuilder()
    .setCustomId("gameVal")
    .setLabel("game (bf1,bfv,bf3,bf4,bf2042)")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const firstInput = new ActionRowBuilder().addComponents(gameNameVal);
  const secondInput = new ActionRowBuilder().addComponents(platformVal);
  const thirdInput = new ActionRowBuilder().addComponents(gameVal);

  modal.addComponents(firstInput, secondInput, thirdInput);

  return modal;
};
