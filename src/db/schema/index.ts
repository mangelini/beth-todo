import { relations } from "drizzle-orm";
import { user } from "./auth";
import { todo } from "./todo";

export { todo } from "./todo";

export { key, session, user } from "./auth";

export const userRelations = relations(user, ({ many }) => ({
  todos: many(todo),
}));

export const todoRelations = relations(todo, ({ one }) => ({
  author: one(user, {
    fields: [todo.authorId],
    references: [user.id],
  }),
}));
