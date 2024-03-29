export const addRole = async (interaction, settings) => {
  if (
    (await interaction.member.roles.cache.some((role) => {
      return [
        settings[0].idfXboxId,
        settings[0].idfPcId,
        settings[0].idfPsId,
      ].includes(role.id);
    })) &&
    !(await interaction.member.roles.cache.some((role) => {
      return [
        settings[0].moderatorId,
        settings[0].seniorModeratorId,
        settings[0].trialModeratorId,
        settings[0].designId,
        settings[0].forceCodeId,
        settings[0].adminId,
        settings[0].modId,
        settings[0].founderId,
        settings[0].headAdminId,
      ].includes(role.id);
    }))
  ) {
    // idf registered tag
    await interaction.member.roles
      .add(settings[0].registeredMember)
      .catch((err) => {
        console.log("Error" + err);
      });
  } else if (
    //staff
    await interaction.member.roles.cache.some((role) => {
      return [
        settings[0].moderatorId,
        settings[0].seniorModeratorId,
        settings[0].trialModeratorId,
        settings[0].designId,
        settings[0].forceCodeId,
        settings[0].adminId,
      ].includes(role.id);
    })
  ) {
    await interaction.member.roles
      .add(settings[0].registeredStaff)
      .catch((err) => {
        console.log("Error" + err);
      });
  } else if (
    await interaction.member.roles.cache.some((role) => {
      return [
        settings[0].modId,
        settings[0].founderId,
        settings[0].headAdminId,
      ].includes(role.id);
    })
  ) {
    // admins
    await interaction.member.roles
      .add(settings[0].registeredMangment)
      .catch((err) => {
        console.log("Error" + err);
      });
  } else {
    await interaction.member.roles.add(settings[0].candidateId).catch((err) => {
      console.log("Error" + err);
    });
  }
};
