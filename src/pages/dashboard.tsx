import { and, eq, gt, lt, sql } from "drizzle-orm";
import { Elysia } from "elysia";
import { FancyLink } from "../components";
import { BaseHtml } from "../components/base";
import { Dashboard } from "../components/dashboard";
import { ctx } from "../context";
import { redirect } from "../lib";

export const dashboard = new Elysia()
  .use(ctx)
  .get("/dashboard", async ({ db, session, set, headers, html }) => {
    if (!session) {
      redirect({ set, headers }, "/login");
      return;
    }

    return html(() => (
      <BaseHtml>
        <Dashboard>
          <main class="flex-1 space-y-4 py-5">
            <div class="relative flex items-center justify-between px-6 py-3">
              <div>
                <h2 class="text-5xl" safe>
                  Welcome, {session.user.handle}
                </h2>
              </div>

              <div class="absolute inset-x-0 bottom-0 h-1 shadow-md"></div>
            </div>
          </main>
        </Dashboard>
      </BaseHtml>
    ));
  });

function Card({
  name,
  value,
  href,
}: {
  name: string;
  value: string;
  href: string;
}) {
  return (
    <div class="relative rounded-md border p-5 ">
      <h3 class="text-xl">{name}</h3>
      <p class="font-bold">{value}</p>
      <FancyLink text="View" href={href} />
    </div>
  );
}
