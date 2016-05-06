"use strict";
const winston = require("winston");
const path = require("path");
const fs = require("fs");
class Logger {
    static init(loggerConfig) {
        let dirPath = loggerConfig.dir + "/logs";
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        this.isDB = loggerConfig.db;
        this.isFile = loggerConfig.file;
        const _dailyRotateFile = require('winston-daily-rotate-file');
        const _consoleOptions = {
            json: false,
            name: 'console'
        };
        const _infoFileOption = {
            datePattern: '.yyyy-MM-ddTHH',
            filename: path.resolve(dirPath, loggerConfig.fileName),
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            name: 'exception'
        };
        const _mongoDBOption = {
            capped: true,
            collection: "log",
            db: loggerConfig.dbURL,
            tryReconnect: false
        };
        winston.loggers.add('logger', {
            transports: [
                new (winston.transports.Console)(_consoleOptions),
                new (_dailyRotateFile)(_infoFileOption)
            ]
        });
        this.logger = winston.loggers.get('logger');
        this.logger.remove(winston.transports.Console);
        if (this.isDB) {
            var mongoDB = require('winston-mongodb').MongoDB;
            winston.loggers.add('mongoDB', {
                mongoDB: _mongoDBOption
            });
            this.dbLogger = winston.loggers.get('mongoDB');
            this.dbLogger.remove(winston.transports.Console);
        }
        console.log("Logger initialized");
    }
    static log(message) {
        if (this.isDB) {
            this.dbLogger.log('info', message);
        }
        else if (this.isFile) {
            this.logger.log('info', message);
        }
    }
    static info(message) {
        if (this.isDB) {
            this.dbLogger.info(message);
        }
        else if (this.isFile) {
            this.logger.info(message);
        }
    }
    static error(message) {
        if (this.isDB) {
            this.dbLogger.error(message);
        }
        else if (this.isFile) {
            this.logger.error(message);
        }
    }
}
exports.Logger = Logger;
