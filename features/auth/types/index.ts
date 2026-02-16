import { user } from "@/db/schema"

export type DBUserT = typeof user.$inferSelect
export type UserT = Omit<DBUserT, "id">
