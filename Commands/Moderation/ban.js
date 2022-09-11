const {Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js")
const ms = require("ms")
module.exports = {
    name: "ban",
    description: "ban users.",
    userPerms: ["BanMembers"],
    botPerms: ["BanMembers"],
    options: [
        {
            name: "user",
            description: "Select the users",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "Provide a reason",
            type: 3,
            required: false
        }
    ],
    category: "Moderation",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true })

        const { options, user, guild } = interaction

        const member = options.getUser("user")
        const reason = options.getString("reason") || "Pas de raison donné."
        let members = guild.members.cache.get(member.id)

        if(member.id === user.id) return interaction.editReply({content: ":x: | Vous ne pouvez pas vous ban vous meme !", ephemeral: true })
        if(guild.ownerId === member.id) return interaction.editReply({content: ":x: | Vous ne pouvez pas ban l'owner du serveur !", ephemeral: true })
        if(guild.members.me.roles.highest.position <= members.roles.highest.position) return interaction.editReply({content: ":x: | je ne peut pas ban un utilisateur qui a un role superieur a moi", ephemeral: true })
        if(interaction.member.roles.highest.position <= members.roles.highest.position) return interaction.editReply({content: ":x: | Vous ne pouvez pas ban un utilisateur qui a un role superieur au votre !", ephemeral: true })

        const Embed = new EmbedBuilder()
        .setColor("Green")

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setCustomId("ban.yes")
            .setLabel("Oui")
            .setEmoji("✅"),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ban.no")
            .setLabel("Non")
            .setEmoji("❌")
        )
        const Page = interaction.editReply({
            embeds: [
                Embed.setDescription("⚠️ | Voulez vous vraiment ban cette personne !")
            ],
            components: [row]
        })

        const collect = await (await Page).createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms("15s")
        })

        collect.on("collect", async i => {
            if(i.user.id !== user.id) return
            switch(i.customId) {
                case "ban.yes":
                    await member.send({
                        embeds: [
                            new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`Vous avez été ban du serveur ${guild.name} pour la raison: ${reason}`)
                        ],
                    }).catch((e) => {
                        interaction.editReply({
                            embeds: [
                                Embed.setDescription(`✅ | ${members} a bien été ban pour la raison: ${reason} mais je n'ai pas pus mp l'utilisateur !`)
                            ]
                        })
                    })
                        await interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | ${members} a bien été ban pour la raison: ${reason}`)
                        ],
                        components: []
                    })
                    await members.ban({reason})

                break;
                case "ban.no":
                    interaction.editReply({
                        embeds: [
                            Embed.setDescription("✅ | La demande de ban a bien été annulé !")
                        ],
                        components: []
                    })
                break;
            }
        })

        collect.on("end", (collected) => {
            if(collected.size > 0) return

            interaction.editReply({
                embeds: [
                    Embed.setDescription(":x: | Le temp est écoulé !")
                ],
                components: []
            })
        })
    }
}