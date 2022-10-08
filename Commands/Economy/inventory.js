const {Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType} = require("discord.js")

module.exports = {
    name: "inventory",
    description: "voir l'inventaire d'un utilisateur",
    category: "economy",
    options: [
        {
            name: "user",
            description: "afficher l'inventaire de l'utilisateur",
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
        let { guild, options } = interaction
        let user = options.getUser("user") || interaction.user
        let data = await client.economy.fetch(user.id)
        if(!data) {
            await client.economy.createProfile(user.id)
            return interaction.reply({content: `L'utilisateur n'avais pas de compte, je lui ai donc créé.`, ephemeral: true })
        }
        let inventory = await client.economy.fetchInventory(guild.id, user.id)
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${user.username} | Inventaire`)
                .setColor("White")
                .setDescription(inventory.inventory ? "`" + inventory.inventory.map((s) => s.name).join("`, `") + "`" : "`Pas d'item dans l'inventaire !`")
            ],
            ephemeral: true
        })
    }
}