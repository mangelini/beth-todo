import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { Dashboard } from "../components/dashboard";
import { ctx } from "../context";
import { redirect } from "../lib";

export const newTodo = new Elysia()
  .use(ctx)
  .get("/new-todo", async ({ html, session, set, headers, db }) => {
    if (!session) {
      redirect(
        {
          set,
          headers,
        },
        "/login",
      );
      return;
    }

    return html(() => (
      <BaseHtml>
        <Dashboard>
          <main
            class="flex h-screen w-full flex-col items-center justify-center gap-5 bg-gray-200"
            hx-ext="response-targets"
          >
            <h1 safe class="text-center text-3xl font-semibold">
              Create a Todo
            </h1>
            <form
              class="w-96 space-y-3 rounded-lg bg-white p-8 shadow-md"
              hx-post="/api/todo"
              hx-target-4xx="#errorMessageCreate"
              hx-target-5xx="#errorMessageCreate"
              hx-swap="innerHTML"
            >
              <label
                for="title"
                class="block text-sm font-medium text-gray-600"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Enter title"
                required="true"
                minlength="1"
                maxlength="30"
                class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <label
                for="description"
                class="block text-sm font-medium text-gray-600"
              >
                Description
              </label>
              <input
                type="text"
                name="description"
                id="description"
                placeholder="Enter description"
                required="true"
                minlength="1"
                maxlength="30"
                class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <button
                type="submit"
                data-loading-disable
                class="flex w-full items-center justify-center rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Create Todo
                <div
                  data-loading
                  class="i-lucide-loader-2 ml-2 animate-spin text-2xl"
                />
              </button>
              <div class=" text-red-400" id="errorMessageCreate" />
            </form>
          </main>
        </Dashboard>
      </BaseHtml>
    ));
  });
