"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const Property_1 = require("../models/Property");
const Enquiry_1 = require("../models/Enquiry");
const seedData_1 = require("../data/seedData");
const slugify = (text) => {
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
        await (0, db_1.connectDB)();
        console.log('Clearing existing database collections...');
        await User_1.User.deleteMany({});
        await Property_1.Property.deleteMany({});
        await Enquiry_1.Enquiry.deleteMany({});
        console.log('Seeding default administrator account...');
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash('admin123', salt);
        const adminUser = new User_1.User({
            name: 'Administrator',
            email: 'admin@newstar.com',
            passwordHash,
            role: 'admin',
        });
        await adminUser.save();
        console.log('Seeding admin user completed successfully.');
        console.log('Seeding sample luxury properties...');
        const propertyDocs = [];
        for (const prop of seedData_1.INITIAL_PROPERTIES) {
            const baseSlug = slugify(prop.title);
            const purpose = prop.badge === 'FOR RENT' ? 'rent' : 'sale';
            const propertyDoc = new Property_1.Property({
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
        for (const enq of seedData_1.INITIAL_ENQUIRIES) {
            // Find matching property ObjectId
            const matchedProp = propertyDocs.find((p) => p.title === enq.propertyTitle);
            const enquiryDoc = new Enquiry_1.Enquiry({
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
        mongoose_1.default.connection.close();
        process.exit(0);
    }
    catch (error) {
        console.error('Seeding database failed with error:', error);
        process.exit(1);
    }
};
seedDatabase();
