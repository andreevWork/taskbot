module.exports.Labels = {
    closeTask: "*Click the task to complete:\n*",
    showTask: tasks =>
        `*Your active tasks:*\n${tasks
            .map(({ title }) => `- ${title}`)
            .join("\n")}`,
    closeTaskAnswer: "Task closed",
    removeNotificationAnswer: "Notification removed",
    oneTimeNotification: (title, isTooLate) =>
        (isTooLate ? "Sorry, but better late than never. " : "") +
        `Remind you about - "${title}"`,
};
