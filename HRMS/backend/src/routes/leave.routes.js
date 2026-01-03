import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';
import { applyLeave, myLeaves, listLeaves, updateLeaveStatus } from '../controllers/leave.controller.js';

const router = Router();

router.use(authRequired);

router.post('/', allowRoles('employee', 'admin', 'hr'), applyLeave);
router.get('/me', allowRoles('employee', 'admin', 'hr'), myLeaves);
router.get('/', allowRoles('admin', 'hr'), listLeaves);
router.patch('/:id/status', allowRoles('admin', 'hr'), updateLeaveStatus);

export default router;
