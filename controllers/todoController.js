import { todos } from '../data/storage.js';

// Get todos for logged-in user
export function getUserTodos(req, res) {
  const userTodos = todos.filter(todo => todo.userId === req.user.id);
  res.json(userTodos);
}

// Create new todo for logged-in user
export function createTodo(req, res) {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ message: 'Task is required.' });
  }

  const newTodo = {
    id: todos.length + 1,
    task,
    userId: req.user.id
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
}

// Delete a specific todo if owned by the user
export function deleteTodo(req, res) {
  const todoId = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === todoId);

  if (todoIndex === -1) {
    return res.status(404).json({ message: 'To-do not found.' });
  }

  if (todos[todoIndex].userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this to-do.' });
  }

  todos.splice(todoIndex, 1);
  res.json({ message: 'To-do deleted successfully.' });
}

// Admin: Get all todos
export function getAllTodos(req, res) {
  res.json(todos);
}
