import { Connection } from "mongoose";

module.exports = (_client: Connection) => {
	// @ts-expect-error // gotta add success to the console type
	console.success("MongoDB connection is ready!");
}
