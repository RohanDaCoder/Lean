/*
   Make Sure To Fill The Config,
   Rename It To config.js
   Move The File To The src/ folder.
*/

module.exports = {
  emojis: {
    money: "<:money:1250301806488195093>",
    no: "<a:no:1258035164379086848>",
    yes: "<a:yes:1258035111929184337>",
  },
  activity: "You",
  rewards: {
    daily: 500,
    weekly: 5000,
    monthly: 10000,
  },
  channels: {
    usage: "Usage Channel ID",
  },
  blacklistedUsers: ["Blacklisted User IDs"],
  commandHandler: {
    devUserIds: ["Developer User IDs"],
  },
  giveaway: {
    giveaway: "@everyone\n\n🎉 **GIVEAWAY** 🎉",
    giveawayEnded: "@everyone\n\n🎉 **GIVEAWAY ENDED** 🎉",
    drawing: "Ends: **{timestamp}**",
    inviteToParticipate: "React with 🎉 to participate!",
    winMessage: "Congratulations, {winners}! You won **{this.prize}**!",
    embedFooter: "{this.winnerCount} winner(s)",
    noWinner: "Giveaway cancelled, no valid participations.",
    hostedBy: "Hosted by: {this.hostedBy}",
    winners: "winner(s)",
    endedAt: "Ended at",
  },
};
