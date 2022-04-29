import { Modal, TextInputComponent } from "discord-modals";

export const getRegisterModal = () => {
  return new Modal() // We create a Modal
    .setCustomId("registerModal")
    .setTitle("Register for iDF tag application")
    .addComponents(
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("gameNameVal")
        .setLabel("Enter your game name (origin)")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setRequired(true), // If it's required or not
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("platformVal")
        .setLabel("Enter your platform (pc,xbox,ps)")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setRequired(true), // If it's required or not
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("gameVal")
        .setLabel("Enter your game (bf1,bf4,bfv ..)")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setRequired(true) // If it's required or not
    );
};
