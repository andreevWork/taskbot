require("dotenv").config();

const Db = require("./db/db");
const createHttpServer = require("./httpServer/httpServer");
const TelegramBot = require("./telegramBot/telegramBot");

Db.connect().then(TelegramBot.init).catch(console.error);

if (process.env.NODE_ENV !== "test" && process.env.PORT) {
    createHttpServer();
}
