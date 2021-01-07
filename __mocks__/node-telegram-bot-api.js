const EventEmitter = require("events");
const TelegramBotEmitter = new EventEmitter();

class TelegramBot {
    static instance;

    constructor(token, settings) {
        if (!TelegramBot.instance) {
            this.token = token;
            this.settings = settings;

            this.sendMessage = jestMocks.set("TelegramSendMessage");

            this.answerCallbackQuery = jestMocks.set(
                "TelegramAnswerCallbackQuery"
            );

            TelegramBot.instance = this;
        }

        return TelegramBot.instance;
    }

    on(...args) {
        TelegramBotEmitter.on(...args);
    }

    _mockMessageFromUser(message) {
        TelegramBotEmitter.emit("message", message);
    }

    _mockCallbackQueryFromUser(message) {
        TelegramBotEmitter.emit("callback_query", message);
    }
}

module.exports = TelegramBot;
