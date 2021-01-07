const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: String,
    weight: { type: Number, default: 1 },
    notification_time: Date,
    date_created: { type: Date, default: Date.now },
    date_completed: Date,
    completed: { type: Boolean, default: false },
    chat_id: Number,
});

TaskSchema.statics.closeTask = function (id) {
    return this.updateOne(
        { _id: id },
        {
            completed: true,
            date_completed: Date.now(),
        }
    );
};

TaskSchema.statics.getTasks = function (id) {
    return this.find({ chat_id: id, completed: false });
};

const TaskModel = mongoose.model("Task", TaskSchema);

module.exports.TaskModel = TaskModel;
