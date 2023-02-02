import { Connection } from "mongoose";

module.exports = (client: Connection) => {
	console.warn("MongoDB connection destroyed!");
}
