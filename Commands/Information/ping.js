const {Client, ChatInputCommandInteraction } = require("discord.js")
module.exports = {
    name: "ping",
    description: "Show pings.",
    category: "Information",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        return interaction.reply({content: `Ping: ${client.ws.ping} ms`})
    }
}