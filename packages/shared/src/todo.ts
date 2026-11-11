import { z } from 'zod';

/** Single source of truth for a Todo, shared by the web and mobile apps. */
export const todoSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, 'Title is required').max(120, 'Max 120 characters'),
  done: z.boolean().default(false),
  createdAt: z.string().datetime(),
});

export const newTodoSchema = todoSchema.pick({ title: true });

export type Todo = z.infer<typeof todoSchema>;
export type NewTodo = z.infer<typeof newTodoSchema>;

/** Pure helpers: easy to unit test and identical on every platform. */
export function createTodo(input: NewTodo, now = new Date(), id = cryptoId()): Todo {
  const { title } = newTodoSchema.parse(input);
  return { id, title, done: false, createdAt: now.toISOString() };
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

export function summarize(todos: Todo[]) {
  const done = todos.filter((t) => t.done).length;
  return { total: todos.length, done, pending: todos.length - done };
}

function cryptoId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
