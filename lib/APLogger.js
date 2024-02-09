"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APLogger = exports.buildAppender = void 0;
const log4js = __importStar(require("log4js"));
function buildAppender(kafkaManager, topic, blueprintId) {
    const stdoutAppender = (layout, timezoneOffset) => {
        const appender = async (loggingEvent) => {
            loggingEvent.context['nodeEnv'] = process.env.NODE_ENV;
            await kafkaManager.sendLogs([
                {
                    message: loggingEvent.data.toString(),
                    logLevel: loggingEvent.level.levelStr,
                    timestamp: new Date().getTime(),
                    blueprintId: blueprintId ? blueprintId : 'unknown-blueprintId',
                    extras: loggingEvent.context || {},
                },
            ], topic);
            process.stdout.write(`AP-LOGGER: ${layout(loggingEvent, timezoneOffset)}\n`);
        };
        appender.shutdown = (done) => {
            process.stdout.write('AP-LOGGER: buildAppender shutdown');
            process.stdout.write('AP-LOGGER: ', done);
        };
        return appender;
    };
    const configure = (config, layouts) => {
        let layout = layouts.colouredLayout;
        if (config.layout) {
            layout = layouts.layout(config.layout.type, config.layout);
        }
        return stdoutAppender(layout, config.timezoneOffset);
    };
    return {
        stdoutAppender: stdoutAppender,
        configure: configure,
    };
}
exports.buildAppender = buildAppender;
class APLogger {
    constructor(appender) {
        APLogger.setLog4jsConfig(appender);
        this.logger = log4js.getLogger();
    }
    getLogger() {
        return this.logger;
    }
    static setLog4jsConfig(appender) {
        log4js.configure({
            appenders: { custom: { type: appender } },
            categories: { default: { appenders: ['custom'], level: 'debug' } },
        });
    }
}
exports.APLogger = APLogger;
//# sourceMappingURL=APLogger.js.map