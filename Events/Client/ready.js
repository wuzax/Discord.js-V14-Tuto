const {Client, channelLink, EmbedBuilder, time } = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "ready",

    /**
     * @param {Client} client
     */
    async execute(client) {
        console.log(`Connectés à ${client.user.username}`)
        console.log(`Le bot est utilisé sur ${client.guilds.cache.size} serveurs !`)
        client.user.setActivity({
            name: "Bot Aplha",
            type: 3
        })
    }
}
