const {Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType} = require("discord.js")

module.exports = {
    name: "add",
    description: "ajouté de l'argent a un utilisateur (banque/liquide)",
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
            description: "le nombre que vous voulez ajouté a l'utilisateur",
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
            await client.economy.addWalletBal(user.id, number)
            interaction.reply({content: `L'utilisateur ${user.tag} a bien été créditer de ${number}€`})
        } else if(type === "bank") {
            await client.economy.addBankBal(user.id, number)
            interaction.reply({content: `L'utilisateur ${user.tag} a bien été créditer de ${number}€`})
        }
    }
}