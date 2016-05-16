import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";
let packageJson = require("../package.json");
class Logger {

    static logger;
    static dbLogger;
    static isDB;
    static isFile;
    static isConsoleLog;

    public static init(loggerConfig: any) {

        let dirPath;

        if (!loggerConfig.dir) {

            if (packageJson._args) {
                dirPath = packageJson._args[0][1] + "/logs";
            } else {
                dirPath = "logs"
            }
        } else {
            dirPath = loggerConfig.dir + "/logs";
        }

        dirPath = loggerConfig.dir + "/logs";


        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        this.isDB = loggerConfig.db;
        this.isFile = loggerConfig.file;
        this.isConsoleLog = loggerConfig.consoleLog;

        const _dailyRotateFile = require('winston-daily-rotate-file');

        const _consoleOptions = <winston.ConsoleTransportOptions>{
            json: false,
            name: 'console'
        };

        const _infoFileOption = <winston.FileTransportOptions>{
            datePattern: '.yyyy-MM-ddTHH',
            filename: path.resolve(dirPath, loggerConfig.fileName),
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            name: 'exception'
        }

        const _mongoDBOption = <winston.FileTransportOptions>{
            capped: true,
            collection: "log",
            db: loggerConfig.dbURL,
            tryReconnect: false
        }

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
    }

    public static log(message: any) {

        if (this.isDB) {
            this.dbLogger.log('info', message);
        }
        if (this.isFile) {
            this.logger.log('info', message);
        }
    }

    public static info(message: any) {

        if (this.isDB) {
            this.dbLogger.info(message);
        }
        if (this.isFile) {
            this.logger.info(message);
        }
    }

    public static error(message: any) {
        if (this.isDB) {
            this.dbLogger.error(message);
        }
        if (this.isFile) {
            this.logger.error(message);
        }
    }
}

export { Logger }
