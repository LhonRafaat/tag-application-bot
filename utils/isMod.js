export const isMod = (interaction, settings) => {
  const modRoleIds = [
    settings[0].founderId,
    settings[0].headAdminId,
    settings[0].modId,
  ];

  return modRoleIds.some((roleId) =>
    interaction.member.roles.cache.has(roleId)
  );
};
