module.exports.TESTS_CHATS = {
    1: {
        id: 11111,
        first_name: "Test_1",
        last_name: "Test_1_1",
        username: "test_username",
    },
    2: {
        id: 22,
        first_name: "Test_2",
        last_name: "Test_2_2",
        username: "test_username_2",
    },
    3: {
        id: 33333,
        first_name: "Test_3",
        last_name: "Test_3_3",
        username: "test_username_3",
    },
};
module.exports.TEST_MESSAGES = {
    1: {
        text: "test text 1",
        chat: module.exports.TESTS_CHATS[1],
    },
    2: {
        text: "test text 2",
        chat: module.exports.TESTS_CHATS[1],
    },
    3: {
        text: "test text 3",
        chat: module.exports.TESTS_CHATS[1],
    },
};
