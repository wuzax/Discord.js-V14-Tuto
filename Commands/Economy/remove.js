const {Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType} = require("discord.js")

module.exports = {
    name: "remove",
    description: "retiré de l'argent a un utilisateur (banque/liquide)",
    category: "economy",
    options: [
        {
            name: "user",
            description: "choisir un utilisateur",
            type: 6,
            required: true
        },
        {
            name: "type",
            description: "choisir entre liquide et banque",
            type: 3,
            choices: [
                { name: "Argent Liquide", value: "wallet" },
                { name: "Argent Bancaire", value: "bank" }
            ],
            required: true
        },
        {
            name: "number",
            description: "le nombre que vous voulez retiré a l'utilisateur",
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
        let user = interaction.options.getUser("user")
        let type = interaction.options.getString("type")
        let number = interaction.options.getInteger("number")
        let data = await client.economy.fetch(user.id)
        if(!data) {
            await client.economy.createProfile(user.id)
            return interaction.reply({content: `L'utilisateur n'avais pas de compte, je lui ai donc créé.`, ephemeral: true })
        }
        if(type === "wallet") {
            if(data.wallet < number) return interaction.reply({content: "L'utilisateur ne dispose pas de autant d'argent liquide !"})
            await client.economy.subtractWalletBal(user.id, number)
            interaction.reply({content: `L'utilisateur ${user.tag} a bien été débiter de ${number}€`})
        } else if(type === "bank") {
            if(data.bank < number) return interaction.reply({content: "L'utilisateur ne dispose pas de autant d'argent en banque !"})
            await client.economy.subtractWalletBal(user.id, number)
            nteraction.reply({content: `L'utilisateur ${user.tag} a bien été débiter de ${number}€`})
        }
    }
}