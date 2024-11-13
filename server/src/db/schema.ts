import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("songs", {
    id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    spotifyId: text("spotifyId", { length: 255 }).notNull(),
    description: text("description", { length: 10000 }),
    date: int("date", { mode: "timestamp" }).notNull()
})

export const usersTable = sqliteTable("users", {
    id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text().notNull(),
    email: text().notNull().unique(),
});

export const auth = sqliteTable("auth", {
    id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    password: text().notNull(),
    email: text().notNull().unique()
});

  