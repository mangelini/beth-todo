import Elysia from "elysia";
import { authGroup } from "./(auth)/*";
import { dashboard } from "./dashboard";
import { index } from "./index";
import { newTodo } from "./new-todo";
import { todosRoute } from "./todos";
import { updateTodo } from "./update-todo";

export const pages = new Elysia()
  .use(index)
  .use(todosRoute)
  .use(authGroup)
  .use(newTodo)
  .use(dashboard)
  .use(updateTodo);
