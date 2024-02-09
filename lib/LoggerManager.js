"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerManager = exports.LogLevel = void 0;
const APLogger_1 = require("./APLogger");
const KafkaManager_1 = require("./KafkaManager");
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["ERROR"] = "error";
    LogLevel["INFO"] = "info";
    LogLevel["TRACE"] = "trace";
    LogLevel["WARNING"] = "warning";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class LoggerManager {
    constructor(kafkaConfig) {
        this.kafkaConfig = kafkaConfig;
    }
    static getLogger() {
        if (!this.defaultInstance) {
            this.defaultInstance = this.buildInstance();
        }
        return this.defaultInstance;
    }
    static getBlueprintLogger(blueprintKey, topic) {
        if (!this.instances.has(blueprintKey)) {
            this.instances.set(blueprintKey, this.buildInstance(blueprintKey));
        }
        APLogger_1.APLogger.setLog4jsConfig((0, APLogger_1.buildAppender)(this.getKafkaManagerInstance(), topic, blueprintKey));
        return this.instances.get(blueprintKey);
    }
    // override in ArchiveLogger subclass with desired config, otherwise uses defaults
    static getKafkaConfig() {
        return null;
    }
    static getDefaultBlueprintIdentifier() {
        throw new Error('To be implemented by subclass');
    }
    static buildInstance(blueprintKey, topic) {
        const kafkaManager = this.getKafkaManagerInstance();
        const identifier = blueprintKey ? blueprintKey : this.getDefaultBlueprintIdentifier();
        const instance = new APLogger_1.APLogger((0, APLogger_1.buildAppender)(kafkaManager, topic, identifier)).getLogger();
        // mock logging in test and development environment
        if (!['staging', 'production'].includes(process.env.NODE_ENV)) {
            instance.log = (level, ...args) => {
                console.log(level, ...args);
            };
        }
        return instance;
    }
    static getKafkaManagerInstance() {
        return KafkaManager_1.KafkaManager.getInstance(LoggerManager.getKafkaConfig());
    }
}
exports.LoggerManager = LoggerManager;
LoggerManager.DEFAULT_BLUEPRINT_IDENTIFIER = 'unknown-identifier';
LoggerManager.instances = new Map();
//# sourceMappingURL=LoggerManager.js.map