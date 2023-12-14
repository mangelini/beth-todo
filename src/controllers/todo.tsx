import { and, eq, like, or } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { ctx } from "../context";
import { Todo, todo } from "../db/schema/todo";
import { redirect } from "../lib";

export const todoController = new Elysia({
  prefix: "/todo",
})
  .use(ctx)
  .post(
    "/fetchFilteredTodos",
    async ({ db, session, set, headers, body }) => {
      if (!session) {
        redirect({ set, headers }, "/login");
        return;
      }

      // const offset = (body.page - 1) * body.pageSize;

      const todos = await db
        .select()
        .from(todo)
        .where(
          and(
            eq(todo.authorId, session.user.userId),
            or(
              like(todo.title, `%groceries%`),
              like(todo.description, `%apple%`),
            ),
          ),
        )
        .orderBy(todo.updatedAt);
      // .limit(body.pageSize)
      // .offset(offset);

      return todos;
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
      }),
    },
  )
  .post(
    "/",
    async ({ db, session, body, set, headers }) => {
      if (!session) {
        set.status = "Unauthorized";
        set.headers["HX-Redirect"] = "/signInOrUp";
        return "Sign in to post a todo.";
      }

      const [todoRes] = await db
        .insert(todo)
        .values({
          authorId: session.user.userId,
          title: body.title,
          description: body.description,
          updatedAt: new Date(),
        })
        .returning();

      if (!todoRes) {
        throw new Error("Failed to create todo");
      }

      redirect(
        {
          set,
          headers,
        },
        `/todos`,
      );
    },
    {
      body: t.Object({
        title: t.String({
          minLength: 1,
          maxLength: 280,
        }),
        description: t.String({
          minLength: 1,
          maxLength: 280,
        }),
      }),
    },
  )
  .delete(
    "/:todoId",
    async ({ session, db, params: { todoId }, set, log }) => {
      if (!session) {
        set.status = "Unauthorized";
        return;
      }

      const [todoRes] = await db.select().from(todo).where(eq(todo.id, todoId));

      log.debug(todoRes);

      if (!todoRes) {
        set.status = "Not Found";
        return;
      }

      if (todoRes.authorId !== session.user.userId) {
        set.status = "Unauthorized";
        return;
      }

      await db.delete(todo).where(eq(todo.id, todoId));
    },
    {
      params: t.Object({
        todoId: t.Numeric(),
      }),
    },
  )
  .patch(
    "/:todoId",
    async ({ session, db, params: { todoId }, body, set, log, headers }) => {
      if (!session) {
        set.status = "Unauthorized";
        return;
      }

      const [todoRes] = await db.select().from(todo).where(eq(todo.id, todoId));

      log.debug(todoRes);

      if (!todoRes) {
        set.status = "Not Found";
        return;
      }

      if (todoRes.authorId !== session.user.userId) {
        set.status = "Unauthorized";
        return;
      }

      await db
        .update(todo)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(todo.id, todoId));

      redirect(
        {
          set,
          headers,
        },
        `/todos`,
      );
    },
    {
      params: t.Object({
        todoId: t.Numeric(),
      }),
      body: t.Object({
        title: t.String({
          minLength: 1,
          maxLength: 280,
        }),
        description: t.String({
          minLength: 1,
          maxLength: 280,
        }),
      }),
    },
  );
