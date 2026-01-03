import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';
import { overview, attritionRisks, smartAttendance } from '../controllers/analytics.controller.js';

const router = Router();

router.use(authRequired);

router.get('/overview', allowRoles('admin', 'hr'), overview);
router.get('/attrition', allowRoles('admin', 'hr'), attritionRisks);
router.get('/attendance-insights', allowRoles('admin', 'hr'), smartAttendance);

export default router;
