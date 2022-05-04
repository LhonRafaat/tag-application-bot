import { Modal, TextInputComponent } from "discord-modals";

export const linkAnotherAccountModal = () => {
  return new Modal() // We create a Modal
    .setCustomId("linkAnotherAccount")
    .setTitle("Register for iDF tag application")
    .addComponents(
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("gameNameVal")
        .setLabel("Enter your game name")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setRequired(true), // If it's required or not
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("platformVal")
        .setLabel("Enter your platform (pc,xboxone,ps4,ps3,xbox360)")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setRequired(true), // If it's required or not
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("gameVal")
        .setLabel("Enter your game (bf1,bfv,bf3,bf4)")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setRequired(true) // If it's required or not
    );
};
