export const isMod = async (interaction, settings) => {
  const isAuthorized = await interaction.member.roles.cache.some((role) => {
    return [
      settings[0].founderId,
      settings[0].headAdminId,
      settings[0].modId,
    ].includes(role.id);
  });

  return isAuthorized;
};
