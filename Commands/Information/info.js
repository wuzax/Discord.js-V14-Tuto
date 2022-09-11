const {Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const moment = require("moment")
const ms = require("ms")
module.exports = {
    name: "info",
    description: "Show channel/guild/user informations.",
    options: [
        {
            name: "user",
            description: "Get user info",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Select the user",
                    type: 6,
                    required: false
                }
            ]
        },
        {
            name: "server",
            description: "Get server info",
            type: 1,
        },
        {
            name: "channel",
            description: "Get channel info",
            type: 1,
            options: [
                {
                    name: "channel",
                    description: "Select the channel",
                    type: 7,
                    required: false
                }
            ]
        }
    ],
    category: "Information",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const { guild, options, user } = interaction

        try {
            switch(options.getSubcommand()) {
                case "user": {
                    const Target = options.getMember("user")
                    await Target.fetch()

                    async function displayHex(Target) {
                        if(Target.displayHexColor !== "#000000") {
                            return Target.displayHexColor;
                        } else {
                            return "#2F3136"
                        }
                    }

                    const Response = new EmbedBuilder()
                    .setColor(await displayHex(Target))
                    .setAuthor({
                        name: `${Target.user.tag} Information`,
                        iconURL: Target.avatarURL({
                            dynamic: true,
                        })
                    })
                    .setThumbnail(`${Target.displayAvatarURL({dynamic: true, size: 1024})}`)
                    .addFields({
                        name: "General",
                        value: `
                        
                        **\`•\` Nom**: ${Target.user}
                        **\`•\` ID**: ${Target.id}
                        <
                        **\`•\` Roles**: ${Target.roles.cache.map(r => r).join(", ").replace("@everyone", " ") || "None"}
                        **\`•\` Il a rejoin le server**: <t:${parseInt(Target.joinedTimestamp / 1000)}:R>
                        **\`•\` Il a créé son compte**: <t:${parseInt(Target.user.createdTimestamp / 1000)}:R>
                        `,
                        inline: false
                    })

                    interaction.reply({
                        embeds: [Response],
                        ephemeral: true
                    })
                } break;
                case "server": {
                    const explicitFilter = {
                        DISABLED: "Off",
                        MEMBERS_WITHOUT_ROLES: "Pas de roles",
                        ALL_MEMBERS: `tout les membres`
                    }
                    const verificationRate = {
                        NONE: "Pas de verification",
                        LOW: "Faible",
                        MEDIUM: "Moyen",
                        HIGH: "Fort",
                        VERY_HIGHT: "Très fort"
                    }

                    const Response = new EmbedBuilder()
                    .setTitle(`Serveur Information`)
                    .setColor("#5865F2")
                    .setThumbnail(guild.iconURL({dynamic: false, size: 1024}))
                    .addFields({
                        name: "General",
                        value: `
                        **\`•\` Nom**: ${guild.name}
                        **\`•\` ID**: ${guild.id}
                        **\`•\` Date de création**: <t:${parseInt(guild.createdTimestamp / 1000)}:R>
                        **\`•\` Créateur**: <@${guild.ownerId}>
                        **\`•\` Description**: ${guild.description || "Pas de description"}
                        **\`•\` Niveau de verification**: ${verificationRate[guild.verificationLevel] || "Pas de verification"}
                        **\`•\` Filtre Explicite**: ${explicitFilter[guild.explicitContentFilter] || "Pas d'explicite"}

                        `,
                        inline: true
                    },
                    {
                        name: "Membres",
                        value:`
                        **\`•\` Total de membres**: ${guild.members.cache.size}
                        **\`•\` Utilisateurs**: ${guild.members.cache.filter((m) => !m.user.bot).size}
                        **\`•\` Bots**: ${guild.members.cache.filter((m) => m.user.bot).size}
                        
                        `,
                        inline: true
                    },
                    {
                        name: "Channels",
                        value: `
                        **\`•\` Total de channels**: ${guild.channels.cache.size}
                        **\`•\` Textuel**: ${guild.channels.cache.filter((c) => c.type === 0).size}
                        **\`•\` Vocal**: ${guild.channels.cache.filter((c) => c.type === 2).size}
                        **\`•\` Threads**: ${guild.channels.cache.filter((c) => c.type === 10 && 11 && 12).size}
                        **\`•\` Stages**: ${guild.channels.cache.filter((c) => c.type === 13).size}
                        **\`•\` News**: ${guild.channels.cache.filter((c) => c.type === 5).size}

                        `,
                        inline: true
                    })
                    interaction.reply({
                        embeds: [Response],
                        ephemeral: true
                    })
                } break;
                case "channel": {
                    const channel = options.getChannel("channel")
                    const channelTypes = {
                        GUILD_TEXT: 'text',
                        DM: 'DM',
                        GUILD_VOICE: 'Voice',
                        GROUP_DM: 'Group DM',
                        GUILD_CATEGORY: 'Category',
                        GUILD_NEWS: 'News/Announcement',
                        GUILD_NEWS_THREAD: 'News Thread',
                        GUILD_PUBLIC_THREAD: 'Public Thread',
                        GUILD_PRIVATE_THREAD: 'Private Thread',
                        GUILD_STAGE_VOICE: 'Stage Voice',
                        GUILD_DIRECTORY: 'Hub Directory',
                        GUILD_FORUM: 'Forum',
                    }
                    
                        const vcmember = channel.members
                        const memberArray = vcmember.size

                        let l;
                        if(channel.type === 2) {
                            l === true;
                        } else {
                            l === false
                        }

                        const Response = new EmbedBuilder()
                        .setColor("#954CE9")
                        .setAuthor({
                            name: `${guild.name} | Channel Information`,
                            iconURL: guild.iconURL({dynamic: true, size: 512})
                        })
                        .setTitle("Channel Information")
                        .addFields({
                            name: "General",
                            value: `
                            **\`•\` Nom**: ${channel}
                            **\`•\` Description**: ${channel.topic || "Pas de description"}
                            **\`•\` ID**: ${channel.id}
                            **\`•\` Category**: ${channel.parentId ? `${channel.parent.name}` : "Pas de category"}
                            **\`•\` Type**: ${channelTypes[channel.type] || "Pas de types"}
                            **\`•\` Position**: ${channel.position}
                            **\`•\` NSFW**: ${channel.nsfw ? "Oui" : "Non"}
                            **\`•\` Date de création**: <t:${parseInt(channel.createdTimestamp / 1000)}:R>
                            `,
                            inline: true
                        })
                    interaction.reply({
                        embeds: [
                            Response
                        ],
                        ephemeral: true
                    })
                }
            }
        } catch(err) {
            console.log(err)
        }
    }
}