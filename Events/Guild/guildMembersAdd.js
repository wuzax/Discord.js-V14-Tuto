const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const Welcome = require("../../Schema/Welcome")

module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const { user, guild } = interaction
        const welcome = await Welcome.findOne({
            guildId: interaction.guild.id,
        })
        if (!welcome) return

        client.channels.cache.get(welcome.channelId).send({
            content: welcome.message
                .replace("{user}", user)
                .replace("{user.name}", user.username)
                .replace("{user.tag}", user.tag)
                .replace("{user.id}", user.id)
                .replace("{guild}", guild.name)
                .replace("{guild.id}", guild.id)
                .replace("{guild.memberCount}", guild.memberCount)
        })
    }
}