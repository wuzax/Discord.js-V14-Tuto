const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const Leave = require("../../Schema/Leave")

module.exports = {
    name: "guildMemberRemove",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const { user, guild } = interaction
        const leave = await Leave.findOne({
            guildId: interaction.guild.id,
        })
        if (!leave) return

        client.channels.cache.get(leave.channelId).send({
            content: leave.message
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