import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createTodo, newTodoSchema, summarize, timeAgo, toggleTodo, type Todo } from '@starter/shared';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  function add() {
    // Same zod schema the web app uses.
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.kicker}>MOBILE · EXPO</Text>
        <Text style={styles.title}>Shared Todos</Text>
        <Text style={styles.muted}>Models and validation come from @starter/shared.</Text>

        <View style={styles.row}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            onSubmitEditing={add}
            placeholder="What needs to be done?"
            accessibilityLabel="New todo"
            style={styles.input}
          />
          <Pressable onPress={add} style={styles.button} accessibilityRole="button">
            <Text style={styles.buttonText}>Add</Text>
          </Pressable>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.muted}>
          {stats.total} total · {stats.done} done · {stats.pending} pending
        </Text>

        <FlatList
          data={todos}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ gap: 8, paddingVertical: 12 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => setTodos((prev) => toggleTodo(prev, item.id))} style={styles.item}>
              <Text style={[styles.itemText, item.done && styles.done]}>{item.title}</Text>
              <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
            </Pressable>
          )}
        />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20, gap: 10 },
  kicker: { color: '#6366f1', fontWeight: '600', letterSpacing: 2, fontSize: 12, marginTop: 24 },
  title: { fontSize: 28, fontWeight: '700' },
  muted: { color: '#737373', fontSize: 13 },
  row: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#d4d4d4', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  button: { backgroundColor: '#4f46e5', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { color: '#ef4444', fontSize: 13 },
  item: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 8, padding: 12 },
  itemText: { flex: 1, fontSize: 16 },
  done: { color: '#a3a3a3', textDecorationLine: 'line-through' },
  time: { color: '#a3a3a3', fontSize: 12 },
});
