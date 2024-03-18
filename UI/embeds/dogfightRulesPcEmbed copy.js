// at the top of your file
import { EmbedBuilder } from "discord.js";

const description = `
:BF4: PC-DF-BF4 
------------------
:BFV: PC-DF-BFV 
------------------
:BF3: PC-DF-BF3 
------------------
:BF1: PC-DF-BF1 
------------------
:BF2042: PC-DF-BF2042 
------------------
   `;

// inside a command, event listener, etc.
export const dogfightRulesPcEmbed = new EmbedBuilder()
  .setColor("#0099ff")
  .setTitle("Pc dogfight roles")
  // .setURL("https://discord.js.org/")
  .setAuthor({
    name: "iDF",
    iconURL:
      "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736",
    url: "https://discord.js.org",
  })
  .setDescription(description);
