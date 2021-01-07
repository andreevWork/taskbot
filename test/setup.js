global.jestMocks = {
    set(name, fn = (...args) => Promise.resolve()) {
        return (this[name] = jest.fn(fn).mockName("name"));
    },

    get(name) {
        return this[name];
    },
};

expect.extend({
    toJsonStringShapeOf(jsonString, shape) {
        const json = JSON.parse(jsonString);

        expect(json).toMatchObject(shape);

        return { pass: true };
    },
});
