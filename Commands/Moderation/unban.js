const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")

module.exports = {
    name: "unban",
    description: "unban a user",
    userPerms: ["Administrator"],
    botPerms: ["Administrator"],
    options: [
        {
            name: "user",
            description: "ID of user you want unban.",
            type: 3, //ApplicationCommandOptionType.String
            required: true
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        let userId = interaction.options.getString("user")
        let user = client.users.cache.get(userId)

        await interaction.guild.members.unban(user).then(async() => {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`L'utilisateur ${user.tag} (||${user.id}||) a bien été unban !`)
                    .setColor("Green")
                ],
                ephemeral: true
            })
        }).catch(async() => {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("Cet utilisateur n'est actuellement pas banni du serveur !")
                    .setColor("Red")
                ],
                ephemeral: true
            })
        })
    }
}