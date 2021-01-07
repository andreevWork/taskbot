const mongoose = require("mongoose");
const { ChatModel } = require("./models/chat");
const { TaskModel } = require("./models/task");

class Db {
    static url = process.env.DB_URL;

    static connect() {
        return new Promise((resolve, reject) => {
            mongoose.connect(Db.url, { useNewUrlParser: true });

            mongoose.connection.once("error", reject);
            mongoose.connection.once("open", resolve);
        });
    }

    static TaskModel = TaskModel;
    static ChatModel = ChatModel;
}

module.exports = Db;
