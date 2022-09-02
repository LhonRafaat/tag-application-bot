export const getiDFJson = (memberId) => {
  return {
    description: `Congratulations <@${memberId}>!\n\nWith your activity and contribution within our community, you are one simple step away from being able to wear our tag. \n\nWe would love to welcome you as a true iDF member and really be greatful if you want to represent us in-game. Expanding our member count by worthy players, will help the community a lot to be noticed. \n\nBut, wearing the tag comes with serious responsibilites and that's why we want to have a short chat with you. \n\nPlease answer the questions below, so we have a general idea of your personality and mindset. First and foremost, there is no right or wrong, so please do us and yourself a favor and answer honest, and without any pressure. \n\nIf you are not interested in representing us, simply leave a message below, informing us about your decision, and the ticket will be closed by our staff.`,
    color: null,
    fields: [
      {
        name: "[ Q1 ]",
        value:
          "What was your impression, about our discord and community, when you first joined us?",
      },
      {
        name: "[ Q2 ]",
        value:
          "What is your impression of it today, since you are a part of it yourself, quite a while now?",
      },
      {
        name: "[ Q3 ]",
        value:
          "Do you have any suggestions, what we could do better in the near future?",
      },
      {
        name: "[ Q4 ]",
        value: "Tell us a bit, why you want to wear the iDF tag?",
      },
      {
        name: "[ Q5 ]",
        value:
          "Please describe in your own words, what does the iDF tag means personally to you and what do you think, does it stands for?",
      },
      {
        name: "[ Q6 ]",
        value:
          "Those who earn the iDF tag, are expected to hold themselves to a higher standard. This means not only being a highly skilled pilot, but it also being an ethical player and a good steward to the community and those around you. Give us an idea, how would demonstrate these values to the community, and how you will earn the privilege to be called IDF?",
      },
      {
        name: "[ Q7 ]",
        value:
          "As a member of iDF, describe how you would handle a situation where you’re playing the game with a group of non-iDF friends, who are spawncamping the enemy team?",
      },
      {
        name: "[ Q8 ]",
        value:
          "As a member of iDF, describe how you would handle a situation where you knew another iDF member was engaged in account sharing, cheating, or another game based serious rule violation?\n\n(Serious rule violation → #rules → ''prohibited conduct'' | ''In-game behavior'')",
      },
    ],
  };
};
