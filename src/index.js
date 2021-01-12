require("dotenv").config();

const Db = require("./db/db");
const TelegramBot = require("./telegramBot/telegramBot");
const { App } = require("./app");

const app = new App(Db, TelegramBot);

app.startBot();

if (process.env.NODE_ENV !== "test" && process.env.PORT) {
    app.startHomePage();
}
