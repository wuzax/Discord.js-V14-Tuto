const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, ChannelType } = require("discord.js")
const Welcome = require("../../Schema/Welcome")
const Leave = require("../../Schema/Leave")
module.exports = {
    name: "config",
    description: "Set config for bot.",
    category: "Administration",
    options: [
        {
            name: "welcome",
            description: "Set welcome system",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Set channel for welcome system",
                    channelTypes: [ChannelType.GuildText],
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                },
                {
                    name: "message",
                    description: "Set message for welcome system",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "leave",
            description: "Set leave system",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Set channel for leave system",
                    channelTypes: [ChannelType.GuildText],
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                },
                {
                    name: "message",
                    description: "Set message for leave system",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply()
        let channel = interaction.options.getChannel("channel")
        let message = interaction.options.getString("message")

        if (interaction.options.getSubcommand() === "welcome") {
            let welcome = await Welcome.findOne({
                guildId: interaction.guild.id,
            })

            if (!welcome) {
                welcome = await new Welcome({
                    guildId: interaction.guild.id,
                    channelId: channel.id,
                    message: message,
                })

                await welcome.save()

                await interaction.editReply({
                    content: "Le sytème de bienvenue a bien été configuré !",
                    ephemeral: true
                })
            }
            if (welcome) {
                await Welcome.findOneAndUpdate(
                    { guildId: interaction.guild.id },
                    { message },
                    { channelId: channel.id }
                )

                await interaction.editReply({
                    content: "Le sytème de bienvenue a bien été configuré !",
                    ephemeral: true
                })
            }
        } else if (interaction.options.getSubcommand() === "leave") {
            let leave = await Leave.findOne({
                guildId: interaction.guild.id,
            })

            if (!leave) {
                leave = await new Leave({
                    guildId: interaction.guild.id,
                    channelId: channel.id,
                    message: message,
                })

                await leave.save()

                await interaction.editReply({
                    content: "Le sytème de leave a bien été configuré !",
                    ephemeral: true
                })
            }
            if (leave) {
                await Leave.findOneAndUpdate(
                    { guildId: interaction.guild.id },
                    { message },
                    { channelId: channel.id }
                )

                await interaction.editReply({
                    content: "Le sytème de leave a bien été configuré !",
                    ephemeral: true
                })
            }

        }
    }
}