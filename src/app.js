const { Notifications } = require("./notifications/notifications");
const createHttpServer = require("./httpServer/httpServer");
const { Labels } = require("./constants/label");

module.exports.App = class App {
    constructor(db, telegramBot) {
        this.db = db;
        this.telegramBot = telegramBot;
    }

    startBot() {
        this.db
            .connect()
            .then(() => {
                this.telegramBot.init(this.db);

                return this._startOneTimeNotifications();
            })
            .catch(console.error);
    }

    startHomePage() {
        createHttpServer();
    }

    async _startOneTimeNotifications() {
        const chats = await this.db.ChatModel.find({});

        for (const { chat_id } of chats) {
            const tasks = await this.db.TaskModel.getTasks(chat_id, {
                notification_time: { $lte: Date.now() },
            });

            for (const { _id } of tasks) {
                this._sendOneTimeNotifications(_id, true);
            }
        }

        this.telegramBot.onUserSetupOneTimeNotifications(
            Notifications.addOneTimeNotificationToQueue
        );

        Notifications.onOneTimeNotification(
            this._sendOneTimeNotifications.bind(this)
        );

        Notifications.runQueueNotifications();
    }

    _sendOneTimeNotifications(taskId, isTooLate) {
        return this.db.TaskModel.findByIdAndDelete(taskId).then(
            ({ title, chat_id }) => {
                this.telegramBot.TelegramBotApi.sendMessage(
                    chat_id,
                    Labels.oneTimeNotification(title, isTooLate)
                );
            }
        );
    }
};
