import { getRequiredPoints } from "../services/settingService.js";
import { questionsEmbed } from "../UI/embeds/questionsEmbed.js";
import { getiDFJson } from "./getiDFJson.js";
export const hasReachedVotes = async (member, settings, client) => {
  const requiredPoints = await getRequiredPoints();
  if (member.votingChannelEnabled) return;
  const guild = await client.guilds?.cache.get(process.env.GUILD_ID);
  if (!guild) return;
  const role = await guild.roles.cache.find((role) => {
    return role.name === "@everyone";
  });
  const mods = await guild.roles.cache.find((role) => {
    return [
      settings[0].founderId,
      settings[0].headAdminId,
      settings[0].modId,
      settings[0].moderatorId,
    ].includes(role.id);
  });
  if (
    (member.skills === requiredPoints &&
      (member.contribution === requiredPoints ||
        member.personality === requiredPoints)) ||
    (member.contribution === requiredPoints &&
      (member.skills === requiredPoints ||
        member.personality === requiredPoints)) ||
    (member.personality === requiredPoints &&
      (member.skills === requiredPoints ||
        member.contribution === requiredPoints))
  ) {
    member.reachedVotes = true;
    await member.save();
    try {
      console.log(settings[0].ticketsParentId);
      const newChannel = await guild.channels.create(member.userNames[0], {
        parent: settings[0].ticketsParentId,
        permissionOverwrites: [
          {
            id: role.id,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: member.discordId,
            allow: ["VIEW_CHANNEL"],
          },
          {
            id: mods.id,
            allow: ["VIEW_CHANNEL"],
          },
        ],
      });

      console.log(getiDFJson());
      const memberId = member.discordId;
      await newChannel.send({ embeds: [getiDFJson(memberId)] });

      member.votingChannelEnabled = true;
      await member.save();
    } catch (error) {
      console.log(error);
    }
  }
};
