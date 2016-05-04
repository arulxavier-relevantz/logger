import { Logger } from "../Logger"

Logger.init("mongodb://localhost/employees", false);

Logger.log("Hello again distributed log");
Logger.info("Hello again distributed info");
Logger.error("Hello again distributed error");

