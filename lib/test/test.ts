import { Logger } from "../Logger"

var loggerConfig = {
          "dir": "",
          "fileName": "microservice-employee.log",
          "dbURL": "mongodb://localhost/employees",
          "db": false,
          "file": true,
          "consoleLog": true
      }

Logger.init(loggerConfig);

Logger.log("Hello again distributed log");
Logger.info("Hello again distributed info");
Logger.error("Hello again distributed error");
