const {Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType} = require("discord.js")

module.exports = {
    name: "pay",
    description: "envoyé de l'argent a un utilisateur",
    category: "economy",
    options: [
        {
            name: "user",
            description: "choisir un utilisateur",
            type: 6,
            required: true
        },
        {
            name: "number",
            description: "le nombre que vous voulez donné a l'utilisateur",
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        await interaction.guild.members.cache.forEach(async(u) => {
            await client.economy.createProfile(u.id)
        })
        let user = interaction.options.getUser("user")
        let number = interaction.options.getInteger("number")
        let userBalance = await client.economy.fetch(user.id)
        let authorBalance = await client.economy.fetch(interaction.user.id)
        if(!userBalance) {
            await client.economy.createProfile(user.id)
            return interaction.reply({content: `L'utilisateur n'avais pas de compte, je lui ai donc créé.`, ephemeral: true })
        }
        if(!authorBalance) {
            await client.economy.createProfile(interaction.user.id)
            return interaction.reply({content: `L'utilisateur n'avais pas de compte, je lui ai donc créé.`, ephemeral: true })
        }
        if(authorBalance.wallet < number) return interaction.reply({content: ":x: | vous ne pouvez pas envoyé autant d'argent !", ephemeral: true })
        await client.economy.addWalletBal(user.id, number)
        await client.economy.subtractWalletBal(interaction.user.id, number)
        interaction.reply({content: `${number}€ ont bien été envoyé a ${user.username} !`})
    }
}