import { Connection } from "mongoose";

module.exports = (_client: Connection) => {
	console.success("MongoDB connection is ready!");
}
