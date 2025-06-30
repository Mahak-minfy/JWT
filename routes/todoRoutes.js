import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeAdmin } from '../middleware/admin.js';
import {
  getUserTodos,
  createTodo,
  deleteTodo,
  getAllTodos
} from '../controllers/todoController.js';

const router = express.Router();

router.get('/', authenticateToken, getUserTodos);
router.post('/', authenticateToken, createTodo);
router.delete('/:id', authenticateToken, deleteTodo);
router.get('/admin/all', authenticateToken, authorizeAdmin, getAllTodos);

export default router;
