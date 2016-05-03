import { CSDLogger } from "../Logger"

CSDLogger.init("mongodb://localhost/employees", false);


CSDLogger.log("Hello again distributed log");
CSDLogger.info("Hello again distributed info");
CSDLogger.error("Hello again distributed error");

