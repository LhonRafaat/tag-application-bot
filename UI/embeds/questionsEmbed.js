import { EmbedBuilder } from "discord.js";

export function getQuestionsEmbed() {
  const applicationsEmbed = new EmbedBuilder()
    .setTitle("iDF Community")
    .setDescription(
      `
        Hi!\n
       Before we can let you into our iDF Discord, we want to ask you a few simple questions!\n
         1. **Why do you want to join us ?**\n
            2. **Where did you hear of us?**\n
            3. **Do you know somebody inside our community?**\n
            4. **How would you describe yourself and your playstyle?**\n
            5- **Please send a screenshot of your EA-App/PSN/XBox nickname, this is required to confirm your identity**.\n
        
        `
    );

  return applicationsEmbed;
}
