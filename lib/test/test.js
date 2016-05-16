"use strict";
var Logger_1 = require("../Logger");
var loggerConfig = {
    "dir": "",
    "fileName": "microservice-employee.log",
    "dbURL": "mongodb://localhost/employees",
    "db": false,
    "file": true,
    "consoleLog": true
};
Logger_1.Logger.init(loggerConfig);
Logger_1.Logger.log("Hello again distributed log");
Logger_1.Logger.info("Hello again distributed info");
Logger_1.Logger.error("Hello again distributed error");
