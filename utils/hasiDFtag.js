export const hasiDFTag = async (member, settings) => {
  await member.fetch();
  const idfRoleIds = [
    settings[0].founderId,
    settings[0].headAdminId,
    settings[0].modId,
    settings[0].idfXboxId,
    settings[0].idfPcId,
    settings[0].idfPsId,
  ];
  console.log(settings[0].idfPcId);

  return idfRoleIds.some((roleId) => member.roles.cache.has(roleId));
};
