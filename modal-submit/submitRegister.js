import { createMember } from "../services/memberService.js";
import { addRole } from "../utils/addRole.js";

export const submitRegister = async (
  modal,
  settings,
  returnedMember,
  client,
  platformVal,
  gameVal
) => {
  //if the user's profile exists , then we create a new member in the db

  createMember(
    modal.user.id,
    returnedMember.data?.id,
    platformVal,
    await modal.member.roles.cache.some((role) =>
      [
        settings[0].idfXboxId,
        settings[0].idfPcId,
        settings[0].idfPsId,
      ].includes(role.id)
    ),

    modal.user.username,
    returnedMember.data?.userName,
    returnedMember.data?.avatar,
    gameVal
  );
  // assign registered role

  // addes a role when user is registered, hardcoded for now

  await addRole(modal, settings);
  try {
    const channel = await client.channels.cache.get(
      settings[0].idfBotChannelId
    );
    await channel.send(
      "<@" +
        modal.user.id +
        "> just registered as " +
        returnedMember.data.userName +
        " !"
    );
  } catch (error) {
    console.log(error);
  }

  return await modal.editReply({
    content: "response collected",

    ephemeral: true,
  });
};
