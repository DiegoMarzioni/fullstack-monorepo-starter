import { describe, expect, it } from 'vitest';
import { createTodo, summarize, toggleTodo } from './todo';
import { timeAgo } from './format';

describe('todo helpers', () => {
  it('creates a trimmed todo', () => {
    const t = createTodo({ title: '  Ship it  ' }, new Date('2026-01-01T00:00:00Z'), 'a1');
    expect(t).toEqual({ id: 'a1', title: 'Ship it', done: false, createdAt: '2026-01-01T00:00:00.000Z' });
  });

  it('rejects empty titles', () => {
    expect(() => createTodo({ title: '   ' })).toThrow();
  });

  it('toggles and summarizes', () => {
    const todos = [createTodo({ title: 'a' }, undefined, '1'), createTodo({ title: 'b' }, undefined, '2')];
    const next = toggleTodo(todos, '1');
    expect(summarize(next)).toEqual({ total: 2, done: 1, pending: 1 });
  });
});

describe('timeAgo', () => {
  it('formats minutes', () => {
    const now = new Date('2026-01-01T00:10:00Z');
    expect(timeAgo('2026-01-01T00:07:00Z', 'en', now)).toBe('3 minutes ago');
  });
});
