import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';
import { createUser, deleteUser, getUserById, listUsers, updateUser } from '../services/userService';
import { UserRole } from '../types';

const router = Router();

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.nativeEnum(UserRole).optional(),
});

router.use(authenticate);
router.use(requireRole([UserRole.ADMIN]));

router.post('/', async (req, res) => {
  const parseResult = createUserSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid request', details: parseResult.error.flatten() });
  }

  const { email, password, role } = parseResult.data;
  const user = await createUser(email, password, role);
  return res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  });
});

router.get('/', async (_req, res) => {
  const users = await listUsers();
  return res.json({
    users: users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    })),
  });
});

router.get('/:id', async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  });
});

router.put('/:id', async (req, res) => {
  const parseResult = updateUserSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid request', details: parseResult.error.flatten() });
  }

  const updated = await updateUser(req.params.id, parseResult.data);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    user: {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    },
  });
});

router.delete('/:id', async (req, res) => {
  const deleted = await deleteUser(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ success: true });
});

export default router;
