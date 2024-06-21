import { ChannelType, PermissionsBitField } from "discord.js";
import { getRequiredPoints } from "../services/settingService.js";
import { getiDFJson } from "./getiDFJson.js";
import { hasiDFTag } from "./hasiDFtag.js";
export const hasReachedVotes = async (
  member,
  settings,
  client,
  discordUser
) => {
  const isiDF = await hasiDFTag(discordUser, settings);
  if (isiDF) return;
  const requiredPoints = await getRequiredPoints();
  if (member.votingChannelEnabled) return;
  const guild = await client.guilds?.cache.get(process.env.GUILD_ID);
  if (!guild) return;
  const role = await guild.roles.cache.find((role) => {
    return role.name === "@everyone";
  });
  const mods = await guild.roles.cache.find((role) => {
    return role.id === settings[0].modId;
  });
  const totalPoints = member.skills + member.contribution + member.personality;

  if (totalPoints >= requiredPoints) {
    member.reachedVotes = true;
    try {
      const newChannel = await guild.channels.create({
        name: member.userNames[0],
        type: ChannelType.GuildText,
        parent: settings[0].ticketsParentId,
        permissionOverwrites: [
          {
            id: role.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: member.discordId,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: mods.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });

      const memberId = member.discordId;
      await newChannel.send({ embeds: [getiDFJson(memberId)] });

      member.votingChannelEnabled = true;
      await member.save();
    } catch (error) {
      console.log(error);
    }
  }
};
