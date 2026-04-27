import {
  User, StudentProfile, BusinessProfile, UserActivityLog,
  AdminLog, Wallet, Faculty, University, Post, Comment, StudentReport,
  Transaction, BoostCampaign, BoostPackage
} from '../../modules/index.js';
import sequelize from '../../config/database.js';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import { sendResponse } from '../../utils/response.js';
import logger from '../../utils/logger.js';

/**
 * POST /api/v1/admin/tools/seed
 * Comprehensive system seeding for Admin Dashboard.
 */
export const seedSystemData = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Universities & Faculties
    const [uom] = await University.findOrCreate({
      where: { name: 'University of Moratuwa' },
      defaults: { name: 'University of Moratuwa' }
    });

    const faculties = {};
    for (const name of [
      'Faculty of Engineering',
      'Faculty of Science',
      'Faculty of Management',
      'Faculty of Information Technology'
    ]) {
      const [fac] = await Faculty.findOrCreate({
        where: { name },
        defaults: { universityId: uom.id, name }
      });
      faculties[name] = fac;
    }

    // 2. Admin User
    await User.findOrCreate({
      where: { email: 'admin@unify.com' },
      defaults: {
        name: 'System Admin',
        email: 'admin@unify.com',
        passwordHash: hashedPassword,
        role: 'Admin',
        status: 'Active',
        isOnline: true,
        lastActive: new Date(),
      }
    });

    // 3. Students
    const studentData = [
      {
        user: { name: 'Alex Johnson', email: 'alex.j@unify.com', phone: '+94771234501', role: 'Student', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexJohnson' },
        profile: { facultyName: 'Faculty of Engineering', tier: 'Premium', registrationNumber: 'ENG-22-045', joinDate: new Date('2021-10-12'), reputationScore: 500 }
      },
      {
        user: { name: 'Kasun Perera', email: 'kasun@uom.lk', phone: '+94771234502', role: 'Student', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KasunPerera' },
        profile: { facultyName: 'Faculty of Engineering', tier: 'Standard', registrationNumber: 'UoC-2023-8842', joinDate: new Date('2022-03-15'), reputationScore: 1820 }
      },
      {
        user: { name: 'Achini Jayasuriya', email: 'achini@uom.lk', phone: '+94771234503', role: 'Student', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AchiniJay' },
        profile: { facultyName: 'Faculty of Science', tier: 'Premium', registrationNumber: 'SCI-2022-1104', joinDate: new Date('2022-06-20'), reputationScore: 3250 }
      },
      {
        user: { name: 'Sarah Miller', email: 'sarah.m@unify.com', phone: '+94771234505', role: 'Student', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahMiller' },
        profile: { facultyName: 'Faculty of Engineering', tier: 'Standard', registrationNumber: 'ENG-23-012', joinDate: new Date('2023-04-12'), reputationScore: 500 }
      }
    ];

    for (const s of studentData) {
      const [user] = await User.findOrCreate({ where: { email: s.user.email }, defaults: { ...s.user, passwordHash: hashedPassword } });
      await user.update({ status: 'Active', isOnline: true });
      const faculty = faculties[s.profile.facultyName];
      await StudentProfile.findOrCreate({
        where: { userId: user.id },
        defaults: { ...s.profile, userId: user.id, facultyId: faculty?.id || null, universityId: uom.id }
      });
    }

    // 4. Businesses
    const businessData = [
      {
        user: { name: 'Coffee House', email: 'coffee@house.lk', role: 'Business', status: 'Active', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=CoffeeHouse' },
        profile: { displayName: 'Coffee House', businessName: 'Coffee House PVT LTD', category: 'FOOD', website: 'www.coffeehouse.lk' }
      },
      {
        user: { name: 'University Chess Club', email: 'chess@uom.lk', role: 'Business', status: 'Active', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChessClub' },
        profile: { displayName: 'University Chess Club', businessName: 'UoM Chess Club', category: 'CLUBS', website: 'www.uomchess.lk' }
      }
    ];

    for (const b of businessData) {
      const [user] = await User.findOrCreate({ where: { email: b.user.email }, defaults: { ...b.user, passwordHash: hashedPassword } });
      await user.update({ status: 'Active', isOnline: true });
      await BusinessProfile.findOrCreate({ where: { userId: user.id }, defaults: { ...b.profile, userId: user.id } });
      await Wallet.findOrCreate({ where: { userId: user.id }, defaults: { userId: user.id, balance: 100000, currency: 'LKR' } });
    }

    // 5. Transactions for Trends
    const wallets = await Wallet.findAll();
    const transactions = [];
    const lastMonth = moment().subtract(1, 'month').toDate();
    for (const wallet of wallets) {
      transactions.push({ walletId: wallet.id, amount: 5000, type: 'CREDIT', status: 'COMPLETED', createdAt: lastMonth });
      transactions.push({ walletId: wallet.id, amount: 8000, type: 'CREDIT', status: 'COMPLETED', createdAt: new Date() });
    }
    await Transaction.bulkCreate(transactions);

    return sendResponse(res, 200, true, 'System data seeded successfully via API');
  } catch (error) {
    logger.error(`Seed Error: ${error.message}`);
    next(error);
  }
};

/**
 * POST /api/v1/admin/tools/fix-enums
 * Fixes PostgreSQL ENUM types for Business Categories.
 */
export const fixDatabaseEnums = async (req, res, next) => {
  try {
    const query = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'enum_business_profiles_category' AND e.enumlabel = 'CLUBS') THEN
          ALTER TYPE "enum_business_profiles_category" ADD VALUE 'CLUBS';
        END IF;
      END
      $$;
    `;
    await sequelize.query(query);
    return sendResponse(res, 200, true, 'Database ENUM types fixed successfully');
  } catch (error) {
    logger.error(`Enum Fix Error: ${error.message}`);
    next(error);
  }
};
