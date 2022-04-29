import { MessageActionRow } from "discord.js";

export const getButton = (buttons) => {
  const button = new MessageActionRow().addComponents(
    ...buttons
  );

  return button;
};
