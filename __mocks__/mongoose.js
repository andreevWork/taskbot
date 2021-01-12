const EventEmitter = require("events");
const MongooseEmitter = new EventEmitter();

class MongooseDocument {
    constructor(fields) {
        this.fields = fields;
    }
}

class MongooseModel {
    constructor(modelName, schema) {
        this.modelName = modelName;
        this.schema = schema;

        const saveDocument = jestMocks.set(
            `${this.modelName}ModelSaveDocument`
        );

        jestMocks.set(`${this.modelName}ModelCreateDocument`, fields => {
            const document = new MongooseDocument(fields);

            document.save = saveDocument;

            return document;
        });

        this.save = jestMocks.set(`${this.schemaName}ModelSaveDocument`);

        this.find = jestMocks.set(`${this.modelName}ModelFind`, (...args) =>
            Promise.resolve([])
        );

        this.updateOne = jestMocks.set(`${this.modelName}ModelUpdateOne`);
        this.findByIdAndDelete = jestMocks.set(
            `${this.modelName}ModelFindByIdAndDelete`
        );

        for (const [key, method] of Object.entries(this.schema.statics)) {
            this.schema.statics[key] = method.bind(this);
        }

        return Object.assign(
            jestMocks.get(`${this.modelName}ModelCreateDocument`),
            this,
            this.schema.statics
        );
    }

    findByIdAndDelete = (...args) => {
        return Promise.resolve(null);
    };

    findOne = (...args) => {
        return Promise.resolve(null);
    };
}

class MongooseSchema {
    constructor(fields) {
        this.fields = fields;
        this.statics = {};
    }
}

class Mongoose {
    static connect(url, settings) {
        Mongoose.url = url;
        Mongoose.settings = settings;
    }

    static connection = {
        on: (...args) => {
            MongooseEmitter.on(...args);
        },
        once: (...args) => {
            MongooseEmitter.once(...args);
        },
    };

    static model(name, schema) {
        return new MongooseModel(name, schema);
    }

    static _mockOpenConnect() {
        MongooseEmitter.emit("open");

        return Promise.resolve();
    }
}

Mongoose.Schema = MongooseSchema;

module.exports = Mongoose;
