import { showModal } from "discord-modals";
import { MessageButton } from "discord.js";
import { findOne } from "../services/memberService.ts";
import { getButton } from "../UI/button.ts";
import { getRegisterModal } from "../UI/registerModal.ts";

export const register = async (interaction, client) => {
  const user = await findOne(interaction.member.id);

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
};
