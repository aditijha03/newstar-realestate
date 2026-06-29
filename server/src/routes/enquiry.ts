import { Router } from 'express';
import { 
  createEnquiry, 
  getAdminEnquiries, 
  updateEnquiryStatus, 
  deleteEnquiry 
} from '../controllers/enquiry';
import { validateEnquiry } from '../validators/enquiry';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public route
router.post('/', validateEnquiry, createEnquiry);

// Admin routes
router.get('/admin/all', authMiddleware, getAdminEnquiries);
router.patch('/admin/status/:id', authMiddleware, updateEnquiryStatus);
router.delete('/admin/delete/:id', authMiddleware, deleteEnquiry);

export default router;
