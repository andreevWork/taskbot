const createHttpServer = require("./httpServer/httpServer");

module.exports.App = class App {
    constructor(db, telegramBot) {
        this.db = db;
        this.telegramBot = telegramBot;
    }

    startBot() {
        this.db
            .connect()
            .then(() => {
                this.telegramBot.initBot();
            })
            .catch(console.error);
    }

    startHomePage() {
        createHttpServer();
    }
};
