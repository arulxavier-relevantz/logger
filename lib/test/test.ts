import { Logger } from "../Logger"

var loggerConfig = {
          "dir": "/Users/carestream/app/sinopia/entity/asd-microservice-logger",
          "fileName": "microservice-employee.log",
          "dbURL": "mongodb://localhost/employees",
          "logDB": false
      }

Logger.init(loggerConfig);

Logger.log("Hello again distributed log");
Logger.info("Hello again distributed info");
Logger.error("Hello again distributed error");

