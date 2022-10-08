const {Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType} = require("discord.js")

module.exports = {
    name: "shop",
    description: "acheter, ajouter, retiré et voir le shop",
    category: "economy",
    options: [
        {
            name: "create",
            description: "créé un objet dans le shop.",
            type: 1,
            options: [
                {
                    name: "name",
                    description: "nom de l'objet",
                    type: 3,
                    required: true
                },
                {
                    name: "price",
                    description: "prix de l'objet",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "retiré un objet du shop",
            type: 1,
            options: [
                {
                    name: "name",
                    description: "nom de l'objet",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "view",
            type: 1,
            description: "voir le shop"
        },
        {
            name: "buy",
            description: "acheter un item",
            type: 1,
            options: [
                {
                    name: "item",
                    description: "nom de l'item dans le shop",
                    type: 3,
                    required: true
                }
            ]
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        let { guild, user, options } = interaction
        let sub = options.getSubcommand()
        let name = options.getString("name")
        let price = options.getInteger("price")
        let item = options.getString("item")
        let data = await client.economy.fetch(user.id)
        if(!data) {
            await client.economy.createProfile(user.id)
            return interaction.reply({content: `L'utilisateur n'avais pas de compte, je lui ai donc créé.`, ephemeral: true })
        }
        switch(sub) {
            case "create": {
                if(!interaction.member.permissions.has("Administrator")) return interaction.reply({content: "tu n'a pas la permissions", ephemeral: true})
                await client.economy.createShopItem(guild.id, name, "item", price, { item: "item" })
                await interaction.reply({content: `L'objet ${name} a bien été créé !`, ephemeral: true })
                break;
            }
            case "remove": {
                if(!interaction.member.permissions.has("Administrator")) return interaction.reply({content: "tu n'a pas la permissions", ephemeral: true})
                if(await client.economy.fetchShopItem(guild.id, name)) {
                    await client.economy.deleteShopItem(guild.id, name)
                    await interaction.reply({content: `L'objet ${name} a bien été supprimé !`, ephemeral: true })
                } else {
                    return await interaction.reply({content: `L'objet ${name} n'existe pas !`, ephemeral: true })
                }
                break;
            }
            case "view": {
                let shop = await client.economy.fetchShopItems(guild.id)
                let embed = new EmbedBuilder()
                .setTitle(`${guild.name} - Shop`)
                .setColor("White")
                let field = [];
                shop ? shop.map((item) => {
                    field.push(
                        {
                            name: `${item.name}`,
                            value: `${item.price}€`
                        }
                    )
                }) : null
                shop ? embed.addFields(field) : embed.setDescription("Pas d'item")
                await interaction.reply({embeds: [embed], ephemeral: true })
                break;
            }
            case "buy": {
                if(!await client.economy.fetchInventory(guild.id, user.id)) {
                    await client.economy.createInventory(guild.id, user.id)
                    return await interaction.reply({content: `Inventaire créé pour ${user.tag} !`, ephemeral: true })
                }
                if(!await client.economy.fetchShopItem(guild.id, item)) {
                    return await interaction.reply({content: `L'objet ${item} n'existe pas !`, ephemeral: true })
                }
                await client.economy.pushToInventory(guild.id, user.id, { name: item })
                await interaction.reply({content: `L'objet ${item} a bien été acheté !`, ephemeral: true })
            }
        }
    }
}