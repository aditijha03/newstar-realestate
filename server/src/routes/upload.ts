import { Router, Request, Response, NextFunction } from 'express';
import { upload } from '../middleware/upload';
import { authMiddleware } from '../middleware/auth';
import { uploadToCloudinary, isCloudinaryConfigured } from '../config/cloudinary';

const router = Router();

// Single upload
router.post('/single', authMiddleware, upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let fileUrl = '';
    if (isCloudinaryConfigured) {
      fileUrl = await uploadToCloudinary(req.file.path);
    } else {
      // Local fallback url (dynamic host detection)
      const protocol = req.protocol;
      const host = req.get('host');
      fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    res.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    next(error);
  }
});

// Multiple gallery uploads
router.post('/gallery', authMiddleware, upload.array('images', 15), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadPromises = files.map(async (file) => {
      if (isCloudinaryConfigured) {
        return await uploadToCloudinary(file.path);
      } else {
        const protocol = req.protocol;
        const host = req.get('host');
        return `${protocol}://${host}/uploads/${file.filename}`;
      }
    });

    const urls = await Promise.all(uploadPromises);

    res.json({
      success: true,
      urls,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
