/// <reference path="../typings/main.d.ts" />
"use strict";
var winston = require("winston");
var path = require("path");
var Logger = (function () {
    function Logger() {
    }
    Logger.init = function (_db, _isDB) {
        this.isDB = _isDB;
        var _dailyRotateFile = require('winston-daily-rotate-file');
        var _consoleOptions = {
            json: false,
            name: 'console'
        };
        var _infoFileOption = {
            datePattern: '.yyyy-MM-ddTHH',
            filename: path.join(__dirname, "../logs", "filelog-info.log"),
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            name: 'exception'
        };
        var _mongoDBOption = {
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
    };
    Logger.log = function (message) {
        if (this.isDB) {
            this.dbLogger.log('info', message);
        }
        else {
            this.logger.log('info', message);
        }
    };
    Logger.info = function (message) {
        if (this.isDB) {
            this.dbLogger.info(message);
        }
        else {
            this.logger.info(message);
        }
    };
    Logger.error = function (message) {
        if (this.isDB) {
            this.dbLogger.error(message);
        }
        else {
            this.logger.error(message);
        }
    };
    return Logger;
}());
exports.Logger = Logger;
