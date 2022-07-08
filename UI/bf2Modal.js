import { Modal, TextInputComponent } from "discord-modals";

export const getBf2Modal = () => {
  return new Modal() // We create a Modal
    .setCustomId("bf2Modal")
    .setTitle("Register your BF2 account")
    .addComponents(
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("bf2NameVal")
        .setLabel("Ingame nickname")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
    );
};
