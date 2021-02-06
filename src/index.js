require("dotenv").config();

const { Db } = require("./db/db");
const { TelegramBot } = require("./telegramBot/telegramBot");
const { TelegramBotApi } = require("./telegramBot/telegramBotApi");
const { App } = require("./app");

const telegramBot = new TelegramBot(Db, TelegramBotApi);
const app = new App(Db, telegramBot);

app.startBot();

if (process.env.NODE_ENV !== "test" && process.env.PORT) {
    app.startHomePage();
}
