import { Connection } from "mongoose";

module.exports = (client: Connection) => {
    // @ts-expect-error // gotta add success to the console type
    console.success("MongoDB connection is ready!");
}
