export const denyLinkAnotherAccount = async (interaction) => {
  return await interaction.editReply({ content: "okay", ephemeral: true });
};
