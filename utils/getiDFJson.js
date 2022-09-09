export const getiDFJson = (memberId) => {
  return {
    description: `Congratulations <@${memberId}>!\n\nYour activity and contribution haven't been unnoticed, and iDF Dogfight Community has given you an opportunity to join iDF Platoon, and wear the iDF tag across platforms.\n\nWe're aiming in expanding our community with new and valued members which will help us grow and be noticed within online games, therefore, we would kindly ask you to participate in a short questionnaire. This will help us understand your personality and mindset. We encourage you to answer the questions with honesty.\n\nIf in any case or moment you've stopped being interested in representing iDF Platoon, just drop us a message and one of our staff will reach out to you and close the ticket.`,
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
