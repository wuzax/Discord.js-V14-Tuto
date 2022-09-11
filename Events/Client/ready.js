const {Client, channelLink, EmbedBuilder, time } = require("discord.js")
const ms = require("ms")
const { channels, readyTimestamp } = require("../..")

module.exports = {
    name: "ready",

    /**
     * @param {Client} client
     */
    async execute(client) {
        const REDEM = new EmbedBuilder ()
     .setDescription('\:thumbsup_tone1: Redémarrage effectué avec succès')
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL(),})
        .setColor('#0000ff')
        .setTimestamp()
        
     
        console.log(`Connectés à ${client.user.username}`)
        console.log(`Le bot est utilisé sur ${client.guilds.cache.size} serveurs !`)

        channels.cache.get(`1008015997548109924`).send({embeds:[REDEM],})
        client.user.setActivity({
            name: "Bot Aplha",
            type: 3
        })
    }
}