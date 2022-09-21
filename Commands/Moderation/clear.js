const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    name: "clear",
    description: "Clear messages and of user.",
    userPerms: ["ManageMessages"],
    botPerms: ["ManageMessages"],
    options: [
        {
            name: "amount",
            description: "Select amount of message you want delete",
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: "user",
            description: "Select the users",
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    category: "Moderation",
    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        let amount = interaction.options.getInteger("amount")
        let user = interaction.options.getUser("user")
        if(amount >= 100) return interaction.reply({content: `:warning: | Je ne peut pas supprimé plus de 100 messages !`})
        if(amount <= 0) return interaction.reply(({content: `:warning: | Pourquoi supprimé un nombre de messages négatif !`}))
        if(!user) {
            await interaction.channel.bulkDelete(amount).then((msg) => {
                interaction.reply({content: `J'ai supprimé ${msg.size}/${amount} messages !`})
            })
        } else {
            let msg = await interaction.channel.messages.fetch({limit: amount})
            let data = [];
            msg.map((m) => m).forEach((m) => {
                if(m.author.id === user.id) data.push(m)
            });

            await interaction.channel.bulkDelete(data.length ? data : 1).then((msg) => {
                interaction.reply({content: `J'ai supprimé ${msg.size}/${amount} messages de ${user.tag} !`})
            })
        }
    }
}