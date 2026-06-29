import { Request, Response, NextFunction } from 'express';
import { Enquiry } from '../models/Enquiry';
import { Property } from '../models/Property';

// PUBLIC: Submit a customer enquiry
export const createEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { propertyId, propertyTitle, name, phone, email, message } = req.body;

    let linkedPropertyId = undefined;
    // Resolve propertyId from DB if possible
    if (propertyId && typeof propertyId === 'string' && propertyId.match(/^[0-9a-fA-F]{24}$/)) {
      linkedPropertyId = propertyId;
    } else {
      // Find property by title to link
      const prop = await Property.findOne({ title: propertyTitle });
      if (prop) {
        linkedPropertyId = prop._id;
      }
    }

    const enquiry = new Enquiry({
      propertyId: linkedPropertyId,
      propertyTitle,
      name,
      phone,
      email,
      message,
      status: 'New'
    });

    const saved = await enquiry.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get all enquiries
export const getAdminEnquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: enquiries });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Update status (New, Contacted, Closed)
export const updateEnquiryStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'New' && status !== 'Contacted' && status !== 'Closed') {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const updated = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Delete enquiry
export const deleteEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await Enquiry.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
