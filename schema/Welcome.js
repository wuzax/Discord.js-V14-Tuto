const { Schema, model} =  require("mongoose")

const welcomeSchema = new Schema({
    guildId: String,
    channelId: String,
    message: String
});

module.exports = model("Welcome", welcomeSchema, "JoinSchema");