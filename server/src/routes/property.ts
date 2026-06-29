import { Router } from 'express';
import { 
  getProperties, 
  getPropertyByIdOrSlug, 
  getAdminProperties, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  togglePropertyField
} from '../controllers/property';
import { validateProperty } from '../validators/property';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public Routes
router.get('/', getProperties);
router.get('/:idOrSlug', getPropertyByIdOrSlug);

// Admin Routes (all protected via authMiddleware)
router.get('/admin/all', authMiddleware, getAdminProperties);
router.post('/admin/create', authMiddleware, validateProperty, createProperty);
router.put('/admin/update/:id', authMiddleware, validateProperty, updateProperty);
router.delete('/admin/delete/:id', authMiddleware, deleteProperty);
router.patch('/admin/toggle/:id', authMiddleware, togglePropertyField);

export default router;
