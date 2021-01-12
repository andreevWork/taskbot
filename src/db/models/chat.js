const mongoose = require("mongoose");

module.exports.ChatModel = mongoose.model(
    "Chat",
    new mongoose.Schema({
        chat_id: Number,
        first_name: String,
        last_name: String,
        username: String,
    })
);
