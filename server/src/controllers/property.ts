import { Request, Response, NextFunction } from 'express';
import { Property, IProperty } from '../models/Property';
import mongoose from 'mongoose';

// Slugify helper
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
};

// Unique slug generator
const generateUniqueSlug = async (title: string, currentId?: string): Promise<string> => {
  let baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 0;
  let exists = true;
  while (exists) {
    const query: any = { slug };
    if (currentId) {
      query._id = { $ne: currentId };
    }
    const prop = await Property.findOne(query);
    if (!prop) {
      exists = false;
    } else {
      count++;
      slug = `${baseSlug}-${count}`;
    }
  }
  return slug;
};

// PUBLIC: Get properties with filtering and pagination
export const getProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: any = { showOnWebsite: true };

    const {
      type,
      badge,
      location,
      budget,
      bedrooms,
      furnishing,
      status,
      search,
      featured,
      sort,
      page = 1,
      limit = 8
    } = req.query;

    // Filters
    if (type && type !== 'All Types') {
      query.type = type;
    }

    if (badge && badge !== 'All') {
      query.badge = badge;
    }

    if (location && location !== 'All Locations') {
      // Bidirectional or partial location match
      query.location = { $regex: location.toString(), $options: 'i' };
    }

    if (budget && budget !== 'Any Budget') {
      const b = budget.toString();
      if (b === 'Under ₹50 Lakh') {
        query.priceVal = { $lt: 5000000 };
      } else if (b === '₹50L – ₹1 Crore') {
        query.priceVal = { $gte: 5000000, $lte: 10000000 };
      } else if (b === '₹1Cr – ₹2 Crore') {
        query.priceVal = { $gte: 10000000, $lte: 20000000 };
      } else if (b === '₹2Cr – ₹5 Crore') {
        query.priceVal = { $gte: 20000000, $lte: 50000000 };
      } else if (b === '₹5Cr – ₹10 Crore') {
        query.priceVal = { $gte: 50000000, $lte: 100000000 };
      } else if (b === 'Above ₹10 Crore') {
        query.priceVal = { $gt: 100000000 };
      }
    }

    if (bedrooms && bedrooms !== 'Any') {
      if (bedrooms === '4+') {
        query.beds = { $gte: 4 };
      } else {
        query.beds = parseInt(bedrooms.toString(), 10);
      }
    }

    if (furnishing && furnishing !== 'All') {
      query.furnishing = furnishing;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search && search.toString().trim()) {
      const searchRegex = new RegExp(search.toString().trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { description: searchRegex }
      ];
    }

    // Pagination
    const pageNum = parseInt(page.toString(), 10) || 1;
    const limitNum = parseInt(limit.toString(), 10) || 8;
    const skipNum = (pageNum - 1) * limitNum;

    // Sorting
    let sortQuery: any = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortQuery = { priceVal: 1 };
    } else if (sort === 'price-desc') {
      sortQuery = { priceVal: -1 };
    }

    const properties = await Property.find(query)
      .sort(sortQuery)
      .skip(skipNum)
      .limit(limitNum);

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: properties,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC: Get property detail by id or slug
export const getPropertyByIdOrSlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idOrSlug } = req.params;
    let property = null;

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      property = await Property.findById(idOrSlug);
    }

    if (!property) {
      property = await Property.findOne({ slug: idOrSlug });
    }

    // Enforce visibility on public details
    if (!property || !property.showOnWebsite) {
      return res.status(404).json({ success: false, message: 'Property not found or inactive' });
    }

    res.json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get all properties (shows drafts/showOnWebsite === false as well)
export const getAdminProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json({ success: true, data: properties });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Create property
export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = await generateUniqueSlug(req.body.title);
    
    // Auto-fill purpose for collection compatibility
    const purpose = req.body.badge === 'FOR RENT' ? 'rent' : 'sale';

    const property = new Property({
      ...req.body,
      slug,
      purpose,
      thumbnail: req.body.image, // Sync thumbnail and image
    });

    const savedProperty = await property.save();
    res.status(201).json({ success: true, data: savedProperty });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Update property
export const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const originalProp = await Property.findById(id);
    if (!originalProp) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    let slug = originalProp.slug;
    if (req.body.title && req.body.title !== originalProp.title) {
      slug = await generateUniqueSlug(req.body.title, id);
    }

    // Auto-fill purpose for collection compatibility
    const purpose = req.body.badge === 'FOR RENT' ? 'rent' : 'sale';

    const updatedData = {
      ...req.body,
      slug,
      purpose,
      thumbnail: req.body.image // Sync thumbnail and image
    };

    const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: updatedProperty });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Delete property
export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await Property.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Toggle fields (showOnWebsite or featured)
export const togglePropertyField = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { field } = req.body; // e.g. "showOnWebsite" or "featured"

    if (field !== 'showOnWebsite' && field !== 'featured') {
      return res.status(400).json({ success: false, message: 'Invalid toggle field' });
    }

    const prop = await Property.findById(id);
    if (!prop) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const updated = await Property.findByIdAndUpdate(
      id,
      { [field]: !prop[field as keyof IProperty] },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
