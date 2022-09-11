const { Perms } = require("../Validations/Permissions")
const { Client } = require("discord.js")
const ms = require("ms")
const { promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)
const Ascii = require("ascii-table")
/**
 * @param { Client } client
 */

module.exports = async(client) => {
    const Table = new Ascii("Commands Loaded")

    let commandArray = []

    const CommandFiles = await PG(`${(process.cwd().replace(/\\/g, "/"))}/Commands/*/*.js`)
 
    CommandFiles.map(async (file) => {
        const command = require(file)
        if(!command.name) return Table.addRow(file.split("/")[7], "Failed", "Missing Name")
        if(!command.context && !command.description) return Table.addRow(command.name, "Failed", "Missing Description")
        if(command.userPerms)
            if(command.userPerms.every(perms => Perms.includes(perms))) command.default_permissions = false
            else return Table.addRow(command.name, "Failed", "Permissions Invalid")
        client.commands.set(command.name, command)
        commandArray.push(command)
        
        await Table.addRow(command.name, "Sucess")
    })

    console.log(Table.toString())

    client.on("ready", () => {
        setInterval(() => {
            // client.guilds.cache.forEach(guild => {
            //     guild.commands.set(commandArray)
            // })

            client.guilds.cache.get("1004436655366754404").commands.set(commandArray)
        }, ms("5s"))
    })
}