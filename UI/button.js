import { ActionRowBuilder } from "discord.js";

export const getButton = (buttons) => {
  const button = new ActionRowBuilder().addComponents(...buttons);

  return button;
};
