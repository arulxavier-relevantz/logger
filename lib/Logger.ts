import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";

class Logger {

    static logger;
    static dbLogger;
    static isDB;

    public static init(_db: string, _isDB: boolean, _logPath: string) {


        var fs = require('fs');
        var dir = _logPath +'/logs';
        
        console.log("dir " + dir);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        
        this.isDB = _isDB;
        const _dailyRotateFile = require('winston-daily-rotate-file');

        const _consoleOptions = <winston.ConsoleTransportOptions>{
            json: false,
            name: 'console'
        };

        const _infoFileOption = <winston.FileTransportOptions>{
            datePattern: '.yyyy-MM-ddTHH',
            filename: path.join(_logPath, "logs", "filelog-info.log"),
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            name: 'exception'
        }

        const _mongoDBOption = <winston.FileTransportOptions>{
            capped: true,
            collection: "log",
            db: _db,
            tryReconnect: false
        }

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

    public static log(message: any) {

        if (this.isDB) {
            this.dbLogger.log('info', message);
        } else {
            this.logger.log('info', message);
        }
    }

    public static info(message: any) {

        if (this.isDB) {
            this.dbLogger.info(message);
        } else {
            this.logger.info(message);
        }
    }

    public static error(message: any) {
        if (this.isDB) {
            this.dbLogger.error(message);
        } else {
            this.logger.error(message);
        }
    }
}

export { Logger }
