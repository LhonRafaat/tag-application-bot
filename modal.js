import { Modal, TextInputComponent, showModal } from "discord-modals"; // Now we extract the showModal method
import {
  createMember,
  findOne,
  findOneByName,
} from "./services/memberService.js";
import axios from "axios";
import Canvas from "canvas";
import { voteEmbed } from "./voteEmbed.js";
import { MessageAttachment } from "discord.js";

export const getModal = (client) => {
  let interactionType;
  const modal = new Modal() // We create a Modal
    .setCustomId("modal-customid")
    .setTitle("Test of Discord-Modals!")
    .addComponents(
      new TextInputComponent() // We create a Text Input Component
        .setCustomId("textinput-customid")
        .setLabel("Some text Here")
        .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
        .setMinLength(4)
        .setMaxLength(10)
        .setPlaceholder("Write a text here")
        .setRequired(true) // If it's required or not
    );

  client.on("interactionCreate", async (interaction) => {
    if (interaction.commandName === "modal") {
      interactionType = "modal";
      if (await findOne(interaction.member.id))
        interaction.reply("You are already in the database");
      else
        showModal(modal, {
          client: client, // Client to show the Modal through the Discord API.
          interaction: interaction, // Show the modal with interaction data.
        });
    } else if (interaction.customId === "search") {
      interactionType = "vote";
      showModal(modal, {
        client: client, // Client to show the Modal through the Discord API.
        interaction: interaction, // Show the modal with interaction data.
      });
    }
  });
  client.on("modalSubmit", async (modal, data) => {
    console.log(modal);
    if (modal.customId === "modal-customid") {
      const inputValue = modal.getTextInputValue("textinput-customid");

      //if its for voting we dont want to create a user
      if (interactionType === "modal") {
        axios
          .get(
            `https://api.gametools.network/bfv/all/?format_values=false&name=${inputValue}&lang=en-us&platform=pc&`
          )
          .then((returnedMember) => {
            //check if the user's profile exists
            if (returnedMember?.data?.id) {
              //if the user's profile exists , then we create a new member in the db

              createMember(
                modal.user.id,
                returnedMember.data.id,
                "pc",
                returnedMember.data.platoons
                  .map((el) => el.id)
                  //this is idf platoon id, hardcoded for now
                  .includes("fbc7c5ab-c125-41f9-be8c-f367c03b2551"),

                modal.user.username
              );
            }
          });
        // assign registered role

        // addes a role when user is registered, hardcoded for now

        modal.member.roles.add("968118833187545088");

        await modal.deferReply({ ephemeral: true });
        modal.followUp({
          content: "response collected",

          ephemeral: true,
        });
      } else if (interactionType === "vote") {
        const canvas = Canvas.createCanvas(1500, 500);
        const context = canvas.getContext("2d");

        const background = await Canvas.loadImage("./assets/images/space.png");

        // This uses the canvas dimensions to stretch the image onto the entire canvas
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        const avatar = await Canvas.loadImage(
          modal.member.displayAvatarURL({ format: "jpg" })
        );
        context.drawImage(avatar, 25, 25, 200, 200);
        context.strokeRect(0, 0, canvas.width, canvas.height);

        // Select the font size and type from one of the natively available fonts
        context.font = "80px sans-serif";

        // Select the style that will be used to fill the text in
        context.fillStyle = "#ffffff";

        // Actually fill the text with a solid color
        context.fillText(
          modal.member.displayName,
          canvas.width / 5.5,
          canvas.height / 3.0
        );
        context.font = "50px sans-serif";
        context.fillText("Skills :", canvas.width / 5.5, canvas.height / 2.0);
        context.fillText("Contribution :", 100, canvas.height / 1.6);
        context.fillText("Personality: ", 140, canvas.height / 1.3);
        //we repeat fill rect twice once with white once with red to stimulate a progressbar.
        context.fillStyle = "#ffffff";
        context.fillRect(480, 220, 1000, 20);
        context.fillStyle = "#ff0000";
        context.fillRect(480, 220, 400, 20);
        context.fillStyle = "#ffffff";
        context.fillRect(480, 300, 1000, 20);
        context.fillStyle = "#ff0000";

        context.fillRect(480, 300, 300, 20);
        context.fillStyle = "#ffffff";

        context.fillRect(480, 370, 1000, 20);
        context.fillStyle = "#ff0000";

        context.fillRect(480, 370, 700, 20);

        // Use the helpful Attachment class structure to process the file for you
        const attachment = new MessageAttachment(
          canvas.toBuffer(),
          "profile-image.png"
        );
        // search by game name, maybe if we can use discord Id would be great.
        const member = await findOneByName(inputValue);
        console.log(member);

        // //TODO: make the button reusable
        // const row = new MessageActionRow().addComponents(
        //   new MessageButton()
        //     .setCustomId("vote")
        //     .setLabel("Vote now")
        //     .setStyle("PRIMARY")
        // );
        //TODO: send a error message when user doesnt exist
        await modal.deferReply({ ephemeral: false });
        const message = await modal.followUp({
          // content: `name : ${member.fullName}
          //           originId: ${member.originId}
          //           platforms: ${member.platforms}

          // `,

          embeds: [voteEmbed],
          ephemeral: true,
          files: [attachment],
        });
        Promise.all([
          message.react("🍎"),
          message.react("🍊"),
          message.react("🍇"),
        ]).catch((error) =>
          console.error("One of the emojis failed to react:", error)
        );
      }
    }
  });
};
