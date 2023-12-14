import Elysia from "elysia";
import { authController } from "./auth";
import { todoController } from "./todo";

export const api = new Elysia({
  prefix: "/api",
})
  .use(authController)
  .use(todoController);
