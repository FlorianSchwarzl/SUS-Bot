import { Connection } from "mongoose";

module.exports = (_client: Connection) => {
	console.info("Connecting to MongoDB...");
};
