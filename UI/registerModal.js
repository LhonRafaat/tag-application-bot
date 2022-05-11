import { Modal, TextInputComponent } from "discord-modals";

export const getRegisterModal = () => {
  return new Modal() // We create a Modal
    .setCustomId("registerModal")
    .setTitle("Register for iDF tag application")
    .addComponents(
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("gameNameVal")
        .setLabel("game name")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setRequired(true), // If it's required or not
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("platformVal")
        .setLabel("platform (pc,xboxone,ps4,ps3,xbox360)")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setRequired(true), // If it's required or not
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("gameVal")
        .setLabel("game (bf1,bfv,bf3,bf4)")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setRequired(true) // If it's required or not
    );
};
