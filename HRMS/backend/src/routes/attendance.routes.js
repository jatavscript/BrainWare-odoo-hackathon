import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';
import { checkIn, checkOut, myAttendance, listAttendance } from '../controllers/attendance.controller.js';

const router = Router();

router.use(authRequired);

router.post('/check-in', allowRoles('employee', 'admin', 'hr'), checkIn);
router.post('/check-out', allowRoles('employee', 'admin', 'hr'), checkOut);
router.get('/me', allowRoles('employee', 'admin', 'hr'), myAttendance);
router.get('/', allowRoles('admin', 'hr'), listAttendance);

export default router;
