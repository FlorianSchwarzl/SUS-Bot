import { UserScheme } from "../schemas/user";
import { GuildScheme } from "../schemas/guild";

export type UserData = UserScheme;
export type GuildData = GuildScheme | null;
