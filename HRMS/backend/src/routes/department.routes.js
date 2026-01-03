import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';
import { listDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment } from '../controllers/department.controller.js';

const router = Router();

router.use(authRequired);

router.get('/', allowRoles('admin', 'hr', 'employee'), listDepartments);
router.get('/:id', allowRoles('admin', 'hr'), getDepartment);
router.post('/', allowRoles('admin', 'hr'), createDepartment);
router.put('/:id', allowRoles('admin', 'hr'), updateDepartment);
router.delete('/:id', allowRoles('admin'), deleteDepartment);

export default router;
