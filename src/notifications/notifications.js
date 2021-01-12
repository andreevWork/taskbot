const EventEmitter = require("events");
const NotificationsEmitter = new EventEmitter();

module.exports.Notifications = class Notifications {
    static _timerId = 0;
    static _notificationsByChatsId = {};
    static _defaultNotificationsObject = {
        oneTime: [],
    };

    static addOneTimeNotificationToQueue({ chatId, time, taskId }) {
        Notifications._notificationsByChatsId[chatId] =
            Notifications._notificationsByChatsId[chatId] ||
            Notifications._defaultNotificationsObject;

        Notifications._notificationsByChatsId[chatId].oneTime.push({
            time,
            taskId,
        });
    }

    static onOneTimeNotification(cb) {
        NotificationsEmitter.on("one_time_notifications", cb);
    }

    static runQueueNotifications() {
        Notifications._timerId = setInterval(
            () => {
                const now = Date.now();

                for (const [chatId, { oneTime }] of Object.entries(
                    Notifications._notificationsByChatsId
                )) {
                    for (const [index, { time, taskId }] of Object.entries(
                        oneTime
                    )) {
                        if (now >= time) {
                            NotificationsEmitter.emit(
                                "one_time_notifications",
                                taskId
                            );

                            oneTime.splice(index, 1);
                        }
                    }
                }
            },
            process.env.NODE_ENV === "test" ? 500 : 5000
        );
    }
};
