import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { Enquiry } from '../models/Enquiry';
import { INITIAL_PROPERTIES, INITIAL_ENQUIRIES } from '../data/seedData';

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Enquiry.deleteMany({});

    console.log('Seeding default administrator account...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      name: 'Administrator',
      email: 'admin@newstar.com',
      passwordHash,
      role: 'admin',
    });
    await adminUser.save();
    console.log('Seeding admin user completed successfully.');

    console.log('Seeding sample luxury properties...');
    const propertyDocs = [];
    for (const prop of INITIAL_PROPERTIES) {
      const baseSlug = slugify(prop.title);
      const purpose = prop.badge === 'FOR RENT' ? 'rent' : 'sale';

      const propertyDoc = new Property({
        title: prop.title,
        slug: baseSlug,
        description: prop.description,
        type: prop.type,
        purpose,
        badge: prop.badge,
        badgeColor: prop.badgeColor,
        price: prop.price,
        priceVal: prop.priceVal,
        negotiable: false,
        location: prop.location,
        beds: prop.beds,
        baths: prop.baths,
        balconies: prop.balconies,
        parking: prop.parking,
        area: prop.area,
        areaVal: prop.areaVal,
        furnishing: prop.furnishing,
        status: prop.status,
        featured: prop.featured,
        showOnWebsite: prop.showOnWebsite,
        image: prop.image,
        thumbnail: prop.image,
        gallery: prop.gallery,
      });

      const savedProp = await propertyDoc.save();
      propertyDocs.push(savedProp);
    }
    console.log(`Seeded ${propertyDocs.length} properties.`);

    console.log('Seeding customer enquiries...');
    for (const enq of INITIAL_ENQUIRIES) {
      // Find matching property ObjectId
      const matchedProp = propertyDocs.find((p) => p.title === enq.propertyTitle);

      const enquiryDoc = new Enquiry({
        propertyId: matchedProp ? matchedProp._id : undefined,
        propertyTitle: enq.propertyTitle,
        name: enq.name,
        phone: enq.phone,
        email: enq.email,
        message: enq.message,
        status: enq.status,
        createdAt: new Date(enq.date),
      });
      await enquiryDoc.save();
    }
    console.log('Seeding enquiries completed successfully.');

    console.log('Seeding process finished successfully! ✅');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding database failed with error:', error);
    process.exit(1);
  }
};

seedDatabase();
