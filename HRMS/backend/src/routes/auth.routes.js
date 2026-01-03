import { Router } from 'express';
import { register, login, me, approveUser } from '../controllers/auth.controller.js';
import { authRequired } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authRequired, me);
router.patch('/approve/:id', authRequired, allowRoles('admin', 'hr'), approveUser);

export default router;
