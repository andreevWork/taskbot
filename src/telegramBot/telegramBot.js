const TelegramBotApi = require("./telegramBotApi");
const { CallbackQueryAction } = require("../constants/telegram");
const { Commands } = require("../constants/telegram");
const { Labels } = require("../constants/label");
const EventEmitter = require("events");
const TelegramBotEmitter = new EventEmitter();

class TelegramBot {
    static init(Db) {
        TelegramBotApi.connect();

        TelegramBot.Db = Db;
        TelegramBot.TelegramBotApi = TelegramBotApi;

        TelegramBot._initHandlerCommands();
        TelegramBot._initHandlerTextMessages();
        TelegramBot._initHandlerCallbackQueries();
    }

    static onUserSetupOneTimeNotifications(cb) {
        TelegramBotEmitter.on("user_setup_one_time_notification", cb);
    }

    static _parseTextMessage(text) {
        let [_, title, time] = text.match(/(^.+)\s-\s(\d{1,3}(?:m|h))$/) || [
            undefined,
            text,
        ];

        if (time) {
            time = new Date(
                new Date().getTime() +
                    parseInt(time) * (time.endsWith("h") ? 60 : 1) * 60 * 1000
            );
        }

        return { time, title };
    }

    static _initHandlerTextMessages() {
        TelegramBotApi.onMessage(async ({ text, chat }) => {
            let { time, title } = TelegramBot._parseTextMessage(text);

            const task = await new TelegramBot.Db.TaskModel({
                title,
                notification_time: time,
                chat_id: chat.id,
            }).save();

            if (time) {
                TelegramBotEmitter.emit("user_setup_one_time_notification", {
                    time,
                    chatId: chat.id,
                    taskId: task._id,
                });
            }
        });
    }

    static _initHandlerCallbackQueries() {
        TelegramBotApi.addCallbackAction(
            CallbackQueryAction.closeTask,
            async ({ id, data }) => {
                await TelegramBotApi.answerCallbackQuery(id, {
                    text: Labels.closeTaskAnswer,
                });

                await TelegramBot.Db.TaskModel.closeTask(data.task_id);
            }
        );
    }

    static _initHandlerCommands() {
        TelegramBotApi.addCommand(Commands.showTasks, async ({ chat }) => {
            const tasks = await TelegramBot.Db.TaskModel.getTasks(chat.id);

            await TelegramBotApi.sendMessage(chat.id, Labels.showTask(tasks), {
                parse_mode: "Markdown",
            });
        });

        TelegramBotApi.addCommand(Commands.start, async ({ chat }) => {
            const chats = await TelegramBot.Db.ChatModel.find({
                chat_id: chat.id,
            });

            if (chats.length === 0) {
                new TelegramBot.Db.ChatModel({
                    chat_id: chat.id,
                    first_name: chat.first_name,
                    last_name: chat.last_name,
                    username: chat.username,
                }).save();
            }
        });

        TelegramBotApi.addCommand(Commands.closeTasks, async ({ chat }) => {
            const tasks = await TelegramBot.Db.TaskModel.getTasks(chat.id);

            await TelegramBotApi.sendMessage(chat.id, Labels.closeTask, {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: tasks.map(({ title, _id }) => [
                        {
                            text: title,
                            callback_data: JSON.stringify({
                                action: CallbackQueryAction.closeTask,
                                task_id: _id,
                            }),
                        },
                    ]),
                },
            });
        });
    }
}

module.exports = TelegramBot;
