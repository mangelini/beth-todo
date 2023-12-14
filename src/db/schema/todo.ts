import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { user } from ".";

export const todo = sqliteTable(
  "todo",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    authorId: text("author_id").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => {
    return {
      authorIdx: index("author_idx").on(table.authorId),
      createdAtIdx: index("created_at_idx").on(table.createdAt),
      updatedAtIdx: index("updated_at_idx").on(table.updatedAt),
    };
  },
);
export type Todo = typeof todo.$inferSelect;
export type InsertTodo = typeof todo.$inferInsert;

export const insertTodoSchema = createInsertSchema(todo);
export const selectTodoSchema = createSelectSchema(todo);
