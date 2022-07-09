import { showModal } from "discord-modals";
import { linkAnotherAccountModal } from "../UI/linkAnotherAccountModal.js";

export const linkAnotherAccount = async (interaction, client) => {
  showModal(linkAnotherAccountModal(), {
    client: client, // Client to show the Modal through the Discord API.
    interaction: interaction, // Show the modal with interaction data.
  });
  // updateUser(user.discordId, )
};
