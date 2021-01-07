const EventEmitter = require("events");
const MongooseEmitter = new EventEmitter();

class MongooseDocument {
    constructor(fields) {
        this.fields = fields;
    }

    save() {
        return Promise.resolve();
    }
}

class MongooseModel {
    constructor(modelName, schema) {
        this.modelName = modelName;
        this.schema = schema;

        jestMocks.set(
            `${this.modelName}ModelCreateDocument`,
            (...args) => new MongooseDocument(...args)
        );

        this.find = jestMocks.set(`${this.modelName}ModelFind`, (...args) =>
            Promise.resolve([])
        );

        this.updateOne = jestMocks.set(`${this.modelName}ModelUpdateOne`);

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
