export const hasiDFTag = async (member, settings) => {
  const isiDF = await member.roles.cache.some((role) => {
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
