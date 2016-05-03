"use strict";
var Logger_1 = require("../Logger");
Logger_1.CSDLogger.init("mongodb://localhost/employees", false);
Logger_1.CSDLogger.log("Hello again distributed log");
Logger_1.CSDLogger.info("Hello again distributed info");
Logger_1.CSDLogger.error("Hello again distributed error");
