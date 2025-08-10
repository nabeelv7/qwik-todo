import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todosTable = sqliteTable("todos", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    is_done: int({ mode: "boolean" }).notNull().default(0),
});
