import { showModal } from "discord-modals";
import { MessageButton } from "discord.js";
import { findOne } from "../services/memberService";
import { getButton } from "../UI/button";
import { getRegisterModal } from "../UI/registerModal";

export const register = async (interaction, interactionType, client) => {
  const user = await findOne(interaction.member.id);

  interactionType = "register";
  if (user) {
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({
      content: "You are already registered , want to link another account?",
      ephemeral: true,

      components: [
        getButton([
          new MessageButton()
            .setCustomId("wantToRegister")
            .setLabel("Yes")
            .setStyle("SUCCESS"),
          new MessageButton()
            .setCustomId("refuseToRegister")
            .setLabel("No")
            .setStyle("DANGER"),
        ]),
      ],
    });
  } else
    showModal(getRegisterModal(), {
      client: client, // Client to show the Modal through the Discord API.
      interaction: interaction, // Show the modal with interaction data.
    });

  return interactionType;
};