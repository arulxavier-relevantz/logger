"use strict";
const Logger_1 = require("../Logger");
var loggerConfig = {
    "dir": "/Users/carestream/app/sinopia/entity/asd-microservice-logger",
    "fileName": "microservice-employee.log",
    "dbURL": "mongodb://localhost/employees",
    "db": true,
    "file": true
};
Logger_1.Logger.init(loggerConfig);
Logger_1.Logger.log("Hello again distributed log");
Logger_1.Logger.info("Hello again distributed info");
Logger_1.Logger.error("Hello again distributed error");
