const TelegramBotApi = require("./telegramBotApi");
const Db = require("../db/db");
const { CallbackQueryAction } = require("../constants/telegram");
const { Commands } = require("../constants/telegram");
const { Labels } = require("../constants/label");

class TelegramBot {
    static init() {
        TelegramBotApi.connect();

        TelegramBot._initHandlerCommands();
        TelegramBot._initHandlerTextMessages();
        TelegramBot._initHandlerCallbackQueries();
    }

    static _initHandlerTextMessages() {
        TelegramBotApi.onMessage(async ({ text, chat }) => {
            const a = await new Db.TaskModel({
                title: text,
                chat_id: chat.id,
            }).save();
        });
    }

    static _initHandlerCallbackQueries() {
        TelegramBotApi.addCallbackAction(
            CallbackQueryAction.closeTask,
            async ({ id, data }) => {
                await TelegramBotApi.answerCallbackQuery(id, {
                    text: Labels.closeTaskAnswer,
                });

                await Db.TaskModel.closeTask(data.task_id);
            }
        );
    }

    static _initHandlerCommands() {
        TelegramBotApi.addCommand(Commands.showTasks, async ({ chat }) => {
            const tasks = await Db.TaskModel.getTasks(chat.id);

            await TelegramBotApi.sendMessage(chat.id, Labels.showTask(tasks), {
                parse_mode: "Markdown",
            });
        });

        TelegramBotApi.addCommand(Commands.start, async ({ chat }) => {
            const chats = await Db.ChatModel.find({ chat_id: chat.id });

            if (chats.length === 0) {
                new Db.ChatModel({
                    chat_id: chat.id,
                    first_name: chat.first_name,
                    last_name: chat.last_name,
                    username: chat.username,
                }).save();
            }
        });

        TelegramBotApi.addCommand(Commands.closeTasks, async ({ chat }) => {
            const tasks = await Db.TaskModel.getTasks(chat.id);

            await TelegramBotApi.sendMessage(chat.id, Labels.closeTask, {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: tasks.map(({ title, id }) => [
                        {
                            text: title,
                            callback_data: JSON.stringify({
                                action: CallbackQueryAction.closeTask,
                                task_id: id,
                            }),
                        },
                    ]),
                },
            });
        });
    }
}

module.exports = TelegramBot;
