import { linkAnotherAccountModal } from "../UI/linkAnotherAccountModal.js";

export const linkAnotherAccount = async (interaction) => {
  return await interaction.showModal(linkAnotherAccountModal());
};
