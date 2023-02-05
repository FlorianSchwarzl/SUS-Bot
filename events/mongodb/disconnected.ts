import { Connection } from "mongoose";

module.exports = (_client: Connection) => {
	console.warn("MongoDB connection destroyed!");
};
