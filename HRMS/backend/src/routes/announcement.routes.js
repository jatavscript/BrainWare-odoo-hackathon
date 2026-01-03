import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';
import { listAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcement.controller.js';

const router = Router();

router.use(authRequired);

router.get('/', allowRoles('admin', 'hr', 'employee'), listAnnouncements);
router.post('/', allowRoles('admin', 'hr'), createAnnouncement);
router.delete('/:id', allowRoles('admin', 'hr'), deleteAnnouncement);

export default router;
