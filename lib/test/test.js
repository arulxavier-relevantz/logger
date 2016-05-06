"use strict";
const Logger_1 = require("../Logger");
Logger_1.Logger.init("mongodb://localhost/employees", false, __dirname);
Logger_1.Logger.log("Hello again distributed log");
Logger_1.Logger.info("Hello again distributed info");
Logger_1.Logger.error("Hello again distributed error");
