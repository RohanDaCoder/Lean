const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Get the current weather for a specified location.")
    .addStringOption(option =>
      option
        .setName("location")
        .setDescription("The location to get the weather for.")
        .setRequired(true)
    ),

  async run({ interaction }) {
    const location = interaction.options.getString("location");

    try {
      await interaction.deferReply();

      const response = await axios.get(`https://api.popcat.xyz/weather?q=${encodeURIComponent(location)}`);
      const weatherData = response.data[0]; // Assuming the first result is the desired one

      const embed = new EmbedBuilder()
        .setTitle(`Weather in ${weatherData.location.name}`)
        .setDescription(`Current weather and forecast for ${weatherData.location.name}`)
        .setThumbnail(weatherData.current.imageUrl)
        .setColor("Random")
        .addFields(
          { name: "Temperature", value: `${weatherData.current.temperature}°C`, inline: true },
          { name: "Feels Like", value: `${weatherData.current.feelslike}°C`, inline: true },
          { name: "Sky", value: weatherData.current.skytext, inline: true },
          { name: "Humidity", value: `${weatherData.current.humidity}%`, inline: true },
          { name: "Wind", value: weatherData.current.winddisplay, inline: true },
          { name: "Observation Time", value: weatherData.current.observationtime, inline: true }
        )
        .addFields(
          { name: "\u200B", value: "\u200B" },
          ...weatherData.forecast.map(forecast => ({
            name: `${forecast.shortday} (${forecast.date})`,
            value: `Low: ${forecast.low}°C, High: ${forecast.high}°C, Sky: ${forecast.skytextday}, Precip: ${forecast.precip}%`,
          }))
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      await interaction.editReply({
        content: "An error occurred while fetching the weather data.",
        ephemeral: true,
      });
    }
  },
};