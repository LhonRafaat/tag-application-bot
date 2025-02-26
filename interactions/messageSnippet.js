import { goEmbed } from "../UI/embeds/goEmbed.js";
import { nickEmbed } from "../UI/embeds/nickEmbed.js";
import { getQuestionsEmbed } from "../UI/embeds/questionsEmbed.js";
import { isMod } from "../utils/isMod.js";

export async function getMessageSnippet(interaction, settings) {
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }
  const id = interaction.options.get("id");

  if (id.value === "qa") {
    await interaction.editReply({
      embeds: [getQuestionsEmbed()],
    });
  } else if (id.value === "nick") {
    await interaction.editReply({
      embeds: [nickEmbed()],
    });
  } else if (id.value === "go") {
    await interaction.editReply({
      embeds: [goEmbed()],
    });
  }
}
