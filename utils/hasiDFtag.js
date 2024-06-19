export const hasiDFTag = async (interaction, settings) => {
  const isiDF = await interaction.member.roles.cache.some((role) => {
    return [
      settings[0].founderId,
      settings[0].headAdminId,
      settings[0].modId,
      settings[0].idfXboxId,
      settings[0].idfPcId,
      settings[0].idfPsId,
    ].includes(role.id);
  });

  return isiDF;
};
