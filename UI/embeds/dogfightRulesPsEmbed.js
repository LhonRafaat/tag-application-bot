// at the top of your file
import { EmbedBuilder } from "discord.js";

const description = `
<:BF4:930520954717757470> PS-DF-BF4
------------------
<:bfv:665843736667881503> PS-DF-BFV
------------------
<:BF1:930520402764111942> PS-DF-BF1
------------------
<:BF2042:930520459777290270> PS-DF-BF2042
------------------
:six: DF-BF6
------------------
   `;

// inside a command, event listener, etc.
export const dogfightRulesPsEmbed = new EmbedBuilder()
  .setColor("#0099ff")
  .setTitle("Playstation dogfight roles")
  // .setURL("https://discord.js.org/")
  .setAuthor({
    name: "iDF",
    iconURL:
      "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736",
    url: "https://discord.js.org",
  })
  .setDescription(description);
