import guildModel from "../schemas/guild";
import { Types } from "mongoose";

export default (guildId: string) => {
    (new guildModel({
        _id: new Types.ObjectId(),
        guildId: guildId,

        channels: {
            welcome: undefined,
            goodbye: undefined,

            allowed: []
        },

        counter: {
            current: 0,
            lastId: undefined,
        },

        warns: [],
        tempBans: [],
    })).save();
}
