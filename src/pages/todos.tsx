import { eq } from "drizzle-orm";
import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { Dashboard } from "../components/dashboard";
import Filter from "../components/filter";
import { ctx } from "../context";
import { Todo, todo } from "../db/schema/todo";
import { redirect } from "../lib";

export const todosRoute = new Elysia()
  .use(ctx)
  .get("/todos", async ({ db, session, set, headers, html, config }) => {
    if (!session) {
      redirect({ set, headers }, "/login");
      return;
    }

    const todos = await db
      .select()
      .from(todo)
      .where(eq(todo.authorId, session.user.id))
      .orderBy(todo.updatedAt);

    return html(() => (
      <BaseHtml>
        <Dashboard>
          <main class="flex-1 space-y-4 py-5">
            <div class="relative flex items-center justify-between px-6 py-3">
              <h2 class="text-5xl" safe>
                Manage Your Todos
              </h2>
              <div class="absolute inset-x-0 bottom-0 h-1 shadow-md"></div>
            </div>

            <div class="px-6">
              {!todos || todos.length === 0 ? (
                <div class="px-6 py-5 text-center">
                  <p class="text-xl">You have no todos.</p>
                </div>
              ) : (
                <>
                  <Filter />
                  <div id="todoList">
                    {todos.map((todo) => (
                      <TodoCard todo={todo} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </main>
        </Dashboard>
      </BaseHtml>
    ));
  });

function TodoCard({ todo }: { todo: Todo }) {
  return (
    <div class="relative h-40 rounded-md border p-5 shadow-lg">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold">{todo.title}</h3>
      </div>
      <p class="text-lg text-gray-500" safe>
        {todo.description}
      </p>
      <p class="text-gray-500" safe>
        {todo.updatedAt.toLocaleString()}
      </p>
      <div class="mt-4 flex justify-end space-x-4">
        <a
          class="text-blue-500 hover:text-blue-700"
          href={`/update-todo/${todo.id}`}
        >
          <div class="i-lucide-edit" />
        </a>
        <button
          class="text-red-500 hover:text-red-700"
          hx-delete={`/api/todo/${todo.id}`}
        >
          <div class="i-lucide-trash" />
        </button>
      </div>
    </div>
  );
}
