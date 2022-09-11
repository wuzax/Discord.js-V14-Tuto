const { Client, CommandInteraction, InteractionType } = require("discord.js")
const { ApplicationCommand } = InteractionType;

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        
        if (!interaction.guild || interaction.user.bot) return;
        if (interaction.type !== ApplicationCommand) return;
        const command = client.commands.get(interaction.commandName)

        if (!command) return interaction.reply({ content: ":x: | Une erreur est survenue !", ephemeral: true }) && client.commands.delete(interaction.commandName)

        if (command.userPerms && command.userPerms.length !== 0) if (!interaction.member.permissions.has(command.userPerms)) return interaction.reply({ content: `:x: | Vous avez besoin des permission \`${command.userPerms.join(", ")}\` pour executer cette commande !`, ephemeral: true })
        if (command.botPerms && command.botPerms.length !== 0) if (!interaction.member.permissions.has(command.botPerms)) return interaction.reply({ content: `:x: | j'ai besoin des permissions \`${command.botPerms.join(", ")}\` pour executer cette command !`, ephemeral: true })        
        command.execute(client, interaction)
    }
}