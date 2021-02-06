const NodeTelegramBotApi = require("node-telegram-bot-api");
const EventEmitter = require("events");
const TelegramBotApiEmitter = new EventEmitter();

module.exports.TelegramBotApi = class TelegramBotApi {
    static _token = process.env.TELEGRAM_BOT_TOKEN;
    static _commands = {};

    static connect() {
        TelegramBotApi._client = new NodeTelegramBotApi(TelegramBotApi._token, {
            polling: true,
        });

        TelegramBotApi._client.on("polling_error", console.error);

        TelegramBotApi._client.on("message", message => {
            if (message.text.startsWith("/")) {
                TelegramBotApi._onCommand(message);
            } else {
                TelegramBotApiEmitter.emit("message", message);
            }
        });

        TelegramBotApi._client.on("callback_query", ({ id, data, from }) => {
            data = JSON.parse(data);

            TelegramBotApiEmitter.emit(`callback_query__${data.action}`, {
                id,
                data,
                from,
            });
        });
    }

    static answerCallbackQuery(id, options) {
        return TelegramBotApi._client.answerCallbackQuery(id, options);
    }

    static sendMessage(chatId, text, options) {
        return TelegramBotApi._client.sendMessage(chatId, text, options);
    }

    static onMessage(cb) {
        TelegramBotApiEmitter.on("message", cb);
    }

    static addCallbackAction(type, cb) {
        TelegramBotApiEmitter.on(`callback_query__${type}`, cb);
    }

    static addCommand(command, cb) {
        TelegramBotApi._commands[command] = cb;
    }

    static _onCommand(message) {
        const commandCb = TelegramBotApi._commands[message.text];

        if (commandCb) {
            commandCb(message);
        }
    }
};
