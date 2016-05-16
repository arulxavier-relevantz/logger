"use strict";
var winston = require("winston");
var path = require("path");
var fs = require("fs");
var packageJson = require("../package.json");
var Logger = (function () {
    function Logger() {
    }
    Logger.init = function (loggerConfig) {
        var dirPath;
        if (!loggerConfig.dir) {
            if (packageJson._args) {
                dirPath = packageJson._args[0][1] + "/logs";
            }
            else {
                dirPath = "logs";
            }
        }
        else {
            dirPath = loggerConfig.dir + "/logs";
        }
        dirPath = loggerConfig.dir + "/logs";
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        this.isDB = loggerConfig.db;
        this.isFile = loggerConfig.file;
        this.isConsoleLog = loggerConfig.consoleLog;
        var _dailyRotateFile = require('winston-daily-rotate-file');
        var _consoleOptions = {
            json: false,
            name: 'console'
        };
        var _infoFileOption = {
            datePattern: '.yyyy-MM-ddTHH',
            filename: path.resolve(dirPath, loggerConfig.fileName),
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            name: 'exception'
        };
        var _mongoDBOption = {
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
        console.log(this.isConsoleLog);
        if (!this.isConsoleLog) {
            this.logger.remove(winston.transports.Console);
        }
        if (this.isDB) {
            var mongoDB = require('winston-mongodb').MongoDB;
            winston.loggers.add('mongoDB', {
                mongoDB: _mongoDBOption
            });
            this.dbLogger = winston.loggers.get('mongoDB');
            this.dbLogger.remove(winston.transports.Console);
        }
        console.log("Logger initialized");
    };
    Logger.log = function (message) {
        if (this.isDB) {
            this.dbLogger.log('info', message);
        }
        if (this.isFile) {
            this.logger.log('info', message);
        }
    };
    Logger.info = function (message) {
        if (this.isDB) {
            this.dbLogger.info(message);
        }
        if (this.isFile) {
            this.logger.info(message);
        }
    };
    Logger.error = function (message) {
        if (this.isDB) {
            this.dbLogger.error(message);
        }
        if (this.isFile) {
            this.logger.error(message);
        }
    };
    return Logger;
}());
exports.Logger = Logger;
