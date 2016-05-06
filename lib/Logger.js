"use strict";
const winston = require("winston");
const path = require("path");
class Logger {
    static init(_db, _isDB, _logPath) {
        var fs = require('fs');
        var dir = _logPath + '/logs';
        console.log("dir " + dir);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        this.isDB = _isDB;
        const _dailyRotateFile = require('winston-daily-rotate-file');
        const _consoleOptions = {
            json: false,
            name: 'console'
        };
        const _infoFileOption = {
            datePattern: '.yyyy-MM-ddTHH',
            filename: path.join(_logPath, "logs", "filelog-info.log"),
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            name: 'exception'
        };
        const _mongoDBOption = {
            capped: true,
            collection: "log",
            db: _db,
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
        else {
            this.logger.log('info', message);
        }
    }
    static info(message) {
        if (this.isDB) {
            this.dbLogger.info(message);
        }
        else {
            this.logger.info(message);
        }
    }
    static error(message) {
        if (this.isDB) {
            this.dbLogger.error(message);
        }
        else {
            this.logger.error(message);
        }
    }
}
exports.Logger = Logger;
