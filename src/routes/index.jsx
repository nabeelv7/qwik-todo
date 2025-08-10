import { component$ } from "@builder.io/qwik";
import { routeLoader$, Form, routeAction$ } from "@builder.io/qwik-city";
import { todosTable } from "~/db/schema";
import db from "~/db";
import { eq } from "drizzle-orm";

export const getTodos = routeLoader$(async () => {
  return await db.select().from(todosTable);
})

export const createTodo = routeAction$(async (data) => {
  await db.insert(todosTable).values({
    name: data.name,
  })
})

export const updateTodo = routeAction$(async (data) => {
  if (data.is_done === "on") {
    await db.update(todosTable)
      .set({ is_done: true })
      .where(eq(todosTable.id, data.id))
  } else {
    await db.update(todosTable)
      .set({ is_done: false })
      .where(eq(todosTable.id, data.id))
  }
})

export default component$(() => {
  const todos = getTodos();
  const action = createTodo();

  return (
    <main class="flex flex-col gap-5 justify-center items-center min-h-screen max-w-screen-lg mx-auto">
      <h1 class="md:text-5xl text-4xl font-bold">📝 Todo App</h1>

      <Form onSubmitCompleted$={(e) => e.target.reset()} class="join px-3" action={action}>
        <input name="name" type="text" class="input join-item md:input-lg bg-base-100" placeholder="Enter task here.." />
        <button type="submit" class="join-item btn btn-primary md:btn-lg">Create Todo</button>
      </Form>

      {/* all todos */}
      <section class="md:w-md w-full">
        <ul>
          {todos.value.map((todo, i) => <TodoItem key={todo.id} todo={todo} index={i + 1} />)}
        </ul>
      </section>
    </main>
  );
});

export const TodoItem = component$(({ todo, index }) => {
  const action = updateTodo()

  return (
    <li class="md:text-3xl text-xl p-5 flex justify-between items-center gap-4">
      <p class="opacity-80"><span class="font-medium">{index}.</span> {todo.name}</p>
      {/* checkbox */}
      <Form action={action}>
        <input type="hidden" name="id" value={todo.id} />
        <input type="checkbox" checked={todo.is_done} class="checkbox checkbox-primary" name="is_done"
          onChange$={(e) => e.target.form?.requestSubmit()}
        />
      </Form>
      {/* checkbox end */}
    </li>
  )
})

export const head = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
