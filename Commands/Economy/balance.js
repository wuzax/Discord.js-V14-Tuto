const {Client, ChatInputCommandInteraction, EmbedBuilder} = require("discord.js")

module.exports = {
    name: "balance",
    description: "voir votre solde",
    category: "economy",
    options: [
        {
            name: "user",
            description: "choisir un utilisateur",
            type: 6,
            required: false
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        let user = interaction.options.getUser("user") || interaction.user;
        let data = await client.economy.fetch(user.id)
        if(!data) {
            await client.economy.createProfile(user.id)
            return interaction.reply({content: `L'utilisateur n'avais pas de compte, je lui ai donc créé.`, ephemeral: true })
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setAuthor({name: `${user.username} | Balance`, iconURL: user.avatarURL()})
                .setThumbnail(user.avatarURL())
                .setColor("Aqua")
                .addFields([
                    {
                        name: "Argent Liquide",
                        value: `${data.wallet}€`
                    },
                    {
                        name: "Argent Bancaire",
                        value: `${data.bank}€`
                    }
                ])
            ]
        })
    }
}