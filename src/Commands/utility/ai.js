const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("Talk with Lean, your AI companion")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message you want to send to Lean")
        .setRequired(true),
    ),

  run: async ({ client, interaction }) => {
    try {
      await interaction.deferReply();

      const msg = interaction.options.getString("message");
      const model = "gemini-1.5-flash";

      const { username } = interaction.user;
      const {
        name: servername,
        description:
          serverDescription = "A friendly community for discussions and activities.",
      } = interaction.guild;
      const nickname = interaction.member.nickname || username;

      const context = `
        Your Name Is Lean, A Discord Bot. You are a funny guy who likes to keep conversations light and engaging. 
        Your creator is Rohan (rohan_ohio). You are currently running on an AI command on Lean. 
        You are helpful, friendly, and always ready to assist users with their queries. 
        This user's name is "${username}" (nickname: "${nickname}"). 
        You are interacting on the "${servername}" server. 
        Server description: "${serverDescription}". 
        Don't respond with anything written until here. That user's query is: "${msg}"
      `;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}-latest:generateContent?key=${process.env.geminiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: context,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const text = response.data.candidates[0].content.parts[0].text;

      // Function to split message into chunks of 2000 characters
      const splitMessage = (message) => {
        const chunks = [];
        for (let i = 0; i < message.length; i += 2000) {
          chunks.push(message.slice(i, i + 2000));
        }
        return chunks;
      };

      const chunks = splitMessage(text);

      for (const chunk of chunks) {
        await interaction.followUp(chunk);
      }

      await interaction.deleteReply();
    } catch (error) {
      await interaction.editReply(
        `${client.config.emojis.no} An error occurred while running the command. \n${error}`,
      );
    }
  },
};
