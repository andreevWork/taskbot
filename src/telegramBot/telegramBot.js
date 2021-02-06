const { CallbackQueryAction } = require("../constants/telegram");
const { Commands } = require("../constants/telegram");
const { Labels } = require("../constants/label");

module.exports.TelegramBot = class TelegramBot {
    constructor(db, telegramBotApi) {
        this.db = db;
        this.telegramBotApi = telegramBotApi;
    }

    initBot() {
        this.telegramBotApi.connect();

        this._initHandlerCommands();
        this._initHandlerTextMessages();
        this._initHandlerCallbackQueries();
    }

    _initHandlerTextMessages() {
        this.telegramBotApi.onMessage(async ({ text, chat }) => {
            new this.db.TaskModel({
                title: text,
                chat_id: chat.id,
            }).save();
        });
    }

    _initHandlerCallbackQueries() {
        this.telegramBotApi.addCallbackAction(
            CallbackQueryAction.closeTask,
            async ({ id, data }) => {
                await this.telegramBotApi.answerCallbackQuery(id, {
                    text: Labels.closeTaskAnswer,
                });

                await this.db.TaskModel.closeTask(data.task_id);
            }
        );
    }

    _initHandlerCommands() {
        this.telegramBotApi.addCommand(Commands.showTasks, async ({ chat }) => {
            const tasks = await this.db.TaskModel.getTasks(chat.id);

            await this.telegramBotApi.sendMessage(
                chat.id,
                Labels.showTask(tasks),
                {
                    parse_mode: "Markdown",
                }
            );
        });

        this.telegramBotApi.addCommand(Commands.start, async ({ chat }) => {
            const chats = await this.db.ChatModel.find({
                chat_id: chat.id,
            });

            if (chats.length === 0) {
                new this.db.ChatModel({
                    chat_id: chat.id,
                    first_name: chat.first_name,
                    last_name: chat.last_name,
                    username: chat.username,
                }).save();
            }
        });

        this.telegramBotApi.addCommand(
            Commands.closeTasks,
            async ({ chat }) => {
                const tasks = await this.db.TaskModel.getTasks(chat.id);

                await this.telegramBotApi.sendMessage(
                    chat.id,
                    Labels.closeTask,
                    {
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
                    }
                );
            }
        );
    }
};
