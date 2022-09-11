const { Schema, model} =  require("mongoose")

const leaveSchema = new Schema({
    guildId: String,
    channelId: String,
    message: String
});

module.exports = model("leave", leaveSchema, "LeftSchema");