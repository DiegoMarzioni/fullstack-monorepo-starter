'use client';

import { useEffect, useState } from 'react';
import { createTodo, newTodoSchema, summarize, timeAgo, toggleTodo, type Todo } from '@starter/shared';

const STORAGE_KEY = 'starter.todos';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTodos(JSON.parse(saved) as Todo[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      /* ignore */
    }
  }, [todos]);

  function add(e: React.FormEvent) {
    e.preventDefault();
    // Same zod schema the mobile app uses.
    const parsed = newTodoSchema.safeParse({ title });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid title');
      return;
    }
    setTodos((prev) => [createTodo(parsed.data), ...prev]);
    setTitle('');
    setError(null);
  }

  const stats = summarize(todos);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 py-16">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-500">Web · Next.js</p>
        <h1 className="mt-1 text-3xl font-bold">Shared Todos</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Validation, models and helpers come from <code>@starter/shared</code>, the same package the Expo app uses.
        </p>
      </header>

      <form onSubmit={add} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo"
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500">Add</button>
      </form>
      {error && <p className="-mt-4 text-sm text-red-500">{error}</p>}

      <p className="text-sm text-neutral-500">
        {stats.total} total · {stats.done} done · {stats.pending} pending
      </p>

      <ul className="flex flex-col gap-2">
        {todos.map((t) => (
          <li key={t.id}>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-800">
              <input type="checkbox" checked={t.done} onChange={() => setTodos((prev) => toggleTodo(prev, t.id))} />
              <span className={t.done ? 'flex-1 text-neutral-400 line-through' : 'flex-1'}>{t.title}</span>
              <span className="text-xs text-neutral-400">{timeAgo(t.createdAt)}</span>
            </label>
          </li>
        ))}
      </ul>
    </main>
  );
}
