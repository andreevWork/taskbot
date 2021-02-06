const { CallbackQueryAction } = require("../src/constants/telegram");
const { TEST_MESSAGES } = require("./data");
const { Commands } = require("../src/constants/telegram");
const { Labels } = require("../src/constants/label");

let TelegramBotApiClient;
const testMessage = TEST_MESSAGES[1];
const testTasks = Object.entries(TEST_MESSAGES).map(
    ([index, { text, chat }]) => ({
        _id: index + 10,
        title: text,
        chat_id: chat.id,
    })
);
const testTask = testTasks[0];

beforeAll(async () => {
    require("../src/index");

    return require("mongoose")
        ._mockOpenConnect()
        .then(() => {
            TelegramBotApiClient = require("node-telegram-bot-api").instance;
        });
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Actions on user messages", () => {
    it("Simple text message", () => {
        TelegramBotApiClient._mockMessageFromUser(testMessage);

        expect(
            jestMocks.get("TaskModelCreateDocument")
        ).toHaveBeenLastCalledWith({
            title: testMessage.text,
            chat_id: testMessage.chat.id,
        });
    });

    it(`${Commands.showTasks} command`, async () => {
        jestMocks.get("TaskModelFind").mockReturnValueOnce(testTasks);

        TelegramBotApiClient._mockMessageFromUser({
            ...testMessage,
            text: Commands.showTasks,
        });

        expect(jestMocks.get("TaskModelFind")).toHaveBeenLastCalledWith({
            chat_id: testMessage.chat.id,
            completed: false,
        });

        await Promise.resolve();

        expect(jestMocks.get("TelegramSendMessage")).toHaveBeenLastCalledWith(
            testMessage.chat.id,
            Labels.showTask(testTasks),
            {
                parse_mode: "Markdown",
            }
        );
    });

    it(`${Commands.start} command if new chat`, async () => {
        TelegramBotApiClient._mockMessageFromUser({
            ...testMessage,
            text: Commands.start,
        });

        expect(jestMocks.get("ChatModelFind")).toHaveBeenLastCalledWith({
            chat_id: testMessage.chat.id,
        });

        await Promise.resolve();

        expect(
            jestMocks.get("ChatModelCreateDocument")
        ).toHaveBeenLastCalledWith({
            ...testMessage.chat,
            chat_id: testMessage.chat.id,
            id: undefined,
        });
    });

    it(`${Commands.start} command if chat already exist`, async () => {
        jestMocks
            .get("ChatModelFind")
            .mockReturnValueOnce([{ chat_id: testMessage.chat.id }]);

        TelegramBotApiClient._mockMessageFromUser({
            ...testMessage,
            text: Commands.start,
        });

        expect(jestMocks.get("ChatModelFind")).toHaveBeenLastCalledWith({
            chat_id: testMessage.chat.id,
        });

        await Promise.resolve();

        expect(jestMocks.get("ChatModelCreateDocument")).not.toHaveBeenCalled();
    });

    it(`${Commands.closeTasks} command`, async () => {
        jestMocks.get("TaskModelFind").mockReturnValueOnce(testTasks);

        TelegramBotApiClient._mockMessageFromUser({
            ...testMessage,
            text: Commands.closeTasks,
        });

        expect(jestMocks.get("TaskModelFind")).toHaveBeenLastCalledWith({
            chat_id: testMessage.chat.id,
            completed: false,
        });

        await Promise.resolve();

        expect(jestMocks.get("TelegramSendMessage")).toHaveBeenLastCalledWith(
            testMessage.chat.id,
            Labels.closeTask,
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: expect.arrayContaining([
                        expect.arrayContaining([
                            expect.objectContaining({
                                text: expect.any(String),
                                callback_data: expect.toJsonStringShapeOf({
                                    action: CallbackQueryAction.closeTask,
                                    task_id: expect.any(String),
                                }),
                            }),
                        ]),
                    ]),
                },
            }
        );
    });

    it(`"${CallbackQueryAction.closeTask}" action from CallbackQuery`, async () => {
        const cbId = Math.floor(Math.random() * 100);
        const taskId = testTask._id;

        TelegramBotApiClient._mockCallbackQueryFromUser({
            from: testMessage.chat,
            id: cbId,
            data: JSON.stringify({
                action: CallbackQueryAction.closeTask,
                task_id: taskId,
            }),
        });

        await Promise.resolve();

        expect(
            jestMocks.get("TelegramAnswerCallbackQuery")
        ).toHaveBeenLastCalledWith(cbId, {
            text: Labels.closeTaskAnswer,
        });

        await Promise.resolve();

        expect(jestMocks.get("TaskModelUpdateOne")).toHaveBeenLastCalledWith(
            { _id: taskId },
            {
                date_completed: expect.any(Number),
                completed: true,
            }
        );
    });
});
