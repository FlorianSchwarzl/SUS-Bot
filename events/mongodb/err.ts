import { Connection } from "mongoose";

module.exports = (client: Connection, err: Error) => {
	console.error(err);
}
