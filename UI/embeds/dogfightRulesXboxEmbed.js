// at the top of your file
import { EmbedBuilder } from "discord.js";

const description = `
------------------
:BF4: XB-DF-BF4 
------------------
:BFV: XB-DF-BFV 
------------------
:BF3: XB-DF-BF3 
------------------
:BF1: XB-DF-BF1 
------------------
:BF2042: XB-DF-BF2042
   `;

// inside a command, event listener, etc.
export const dogfightRulesXboxEmbed = new EmbedBuilder()
  .setColor("#0099ff")
  .setTitle("Xbox dogfight roles")
  // .setURL("https://discord.js.org/")
  .setAuthor({
    name: "iDF",
    iconURL:
      "https://eaassets-a.akamaihd.net/battlelog/prod/emblem/392/590/320/2955055690685760912.png?v=1537200736",
    url: "https://discord.js.org",
  })
  .setDescription(description);
