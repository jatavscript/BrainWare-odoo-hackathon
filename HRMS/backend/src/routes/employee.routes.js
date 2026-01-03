import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';
import { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employee.controller.js';

const router = Router();

router.use(authRequired);

router.get('/', allowRoles('admin', 'hr'), listEmployees);
router.get('/:id', allowRoles('admin', 'hr'), getEmployee);
router.post('/', allowRoles('admin', 'hr'), createEmployee);
router.put('/:id', allowRoles('admin', 'hr'), updateEmployee);
router.delete('/:id', allowRoles('admin', 'hr'), deleteEmployee);

export default router;
