import { showModal } from "discord-modals";
import { getBf2Modal } from "../UI/bf2Modal";

export const registerBf2 = async (interaction, client) => {
  //use discord js input component to get name input

  await showModal(getBf2Modal(), {
    client: client, // Client to show the Modal through the Discord API.
    interaction: interaction, // Show the modal with interaction data.
  });
};
