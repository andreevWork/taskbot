module.exports.Labels = {
    closeTask: "*Click the task to complete:\n*",
    showTask: tasks =>
        `*Your active tasks:*\n${tasks
            .map(({ title }) => `- ${title}`)
            .join("\n")}`,
    closeTaskAnswer: "Task closed",
    removeNotificationAnswer: "Notification removed",
};
