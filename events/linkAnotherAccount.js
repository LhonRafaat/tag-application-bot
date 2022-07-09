import { showModal } from "discord-modals";
import { linkAnotherAccountModal } from "../UI/linkAnotherAccountModal";

export const linkAnotherAccount = async (
  interaction,
  client,
  interactionType
) => {
  showModal(linkAnotherAccountModal(), {
    client: client, // Client to show the Modal through the Discord API.
    interaction: interaction, // Show the modal with interaction data.
  });
  interactionType = "linkAnotherAccount";
  // updateUser(user.discordId, )

  return interactionType;
};
