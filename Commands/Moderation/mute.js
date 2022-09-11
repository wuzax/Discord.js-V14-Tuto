const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js")
const ms = require("ms")
const config = require("../../config")

module.exports = {
    name: "mute",
    description: "mute users.",
    userPerms: ["ModerateMembers"],
    botPerms: ["ModerateMembers"],
    options: [
        {
            name: 'user',
            description: "Selectionner un utilisateur",
            type: ApplicationCommandOptionType.User,
            require: true
        },
        {
            name: 'time',
            description: "Décide du temps de mute de l'utilisateur",
            type: ApplicationCommandOptionType.String,
            require: true
        },
        {
            name: 'reason',
            description: 'la raison du mute',
            type: ApplicationCommandOptionType.String,
            require: false
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
        let time = interaction.options.getString("time")
        let convertedTime = ms(time)
        let reason = interaction.options.getString('reason') || "Pas de raison donné"

        if (!member.moderatable) return interaction.reply({ content: `L\'utilisateur ${user} ne peut pas être mute!`, ephemeral: true })
        if (!convertedTime) return interaction.reply({ content: "Le temps n'est pas valide!", ephemeral: true })

        member.timeout(convertedTime, reason).then(() => {
            const mute = new EmbedBuilder()
                .setTitle(`/!\` un membre a été mute /!\``)
                .setColor('#ea4335')
                .setDescription(` ${user} a été mute pour ${time} ${reason === "Pas de raison donné" ? "" : `\nRaison: ${reason}`}`)
                .setFooter({ text: config.name, iconURL: config.logo })
                .setTimestamp()

            interaction.reply({
                embeds: [mute]                
            })
        })
    }
}
