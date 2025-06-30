import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users } from '../data/storage.js';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret';

router.post('/register', async (req, res) => {
  const { username, password, role = 'user' } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password are required.' });

  if (users.find(u => u.username === username))
    return res.status(409).json({ message: 'User already exists.' });

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ id: users.length + 1, username, passwordHash, role });
  res.status(201).json({ message: 'User registered successfully.' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ accessToken: token });
});

export default router;
