const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    name: "emit",
    description: "emit event",
    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(client, interaction) {
        await client.emit("guildMemberRemove", interaction.member)
        await interaction.reply({content: `évènement émits !`, ephemeral: true })
    }
}