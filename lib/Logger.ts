import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";

class Logger {

    static logger;
    static dbLogger;
    static isDB;

    public static init(loggerConfig: any) {

        let dirPath = loggerConfig.dir + "/logs";     
        
                
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        
        this.isDB = loggerConfig.logDB;
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
