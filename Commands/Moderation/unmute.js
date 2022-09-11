const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js")
const ms = require("ms")
const config = require("../../config")

module.exports = {
    name: "unmute",
    description: "unmute users.",
    userPerms: ["ModerateMembers"],
    botPerms: ["ModerateMembers"],
    options: [
        {
            name: 'user',
            description: "Selectionner un utilisateur",
            type: ApplicationCommandOptionType.User,
            require: true
        }

    ],
    category: 'Moderation',
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    */
    async execute(client, interaction) {
        let user = interaction.options.getUser("user")
        let member = interaction.guild.members.cache.get(user.id)

        if (!member.isCommunicationDisabled()) return interaction.reply({ content: `L\'utilisateur ${user} ne peut pas être unmute!`, ephemeral: true })

        member.timeout(null).then(() => {
            const unmute = new EmbedBuilder()
                .setTitle('tu as de nouveau la parole')
                .setColor('#4cca57')
                .setDescription(`${user} a bien été unmute !\nFais attention la prochaine fois !!!`)
                .setFooter({ text: config.name, iconURL: config.logo })
                .setTimestamp()

            interaction.reply({
                embeds: [unmute]
            })
        })
    }
}