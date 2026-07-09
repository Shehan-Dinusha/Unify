/**
 * Comprehensive Seed File — Admin Management
 *
 * Seeds ALL student and business data needed by the frontend.
 * Follows the exact pattern of create_student_user.js and create_business_user.js.
 *
 * Run: node seed_admin_data.js
 */

import {
  User, StudentProfile, BusinessProfile, UserActivityLog,
  AdminLog, Wallet, Faculty, University, Post, Comment, StudentReport,
  Transaction, BoostCampaign, BoostPackage, ClubProfile
} from '../../modules/index.js';
import sequelize from '../../config/database.js';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import logger from "../../utils/logger.js";

async function seedAdminData() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 1: Universities & Faculties
    // ═══════════════════════════════════════════════════════════════════════

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

    logger.info('✅ Universities & Faculties seeded');

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 2: Admin User (for AdminLog entries)
    // ═══════════════════════════════════════════════════════════════════════

    const [adminUser] = await User.findOrCreate({
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

    logger.info(`✅ Admin User seeded (ID: ${adminUser.id})`);

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 3: Student Users (matching frontend mockStudentProfiles)
    // ═══════════════════════════════════════════════════════════════════════

    const studentData = [
      {
        user: {
          name: 'Alex Johnson',
          email: 'alex.j@unify.com',
          phone: '+94771234501',
          role: 'Student',
          status: 'Active',
          isOnline: true,
          lastActive: new Date(),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexJohnson',
        },
        profile: {
          facultyName: 'Faculty of Engineering',
          tier: 'Premium',
          registrationNumber: 'ENG-22-045',
          joinDate: new Date('2021-10-12'),
          reputationScore: 500,
          adminNotes: [
            { text: 'User has been flagged for review twice this month. Monitor activity closely.', adminName: 'Admin_Sarah', createdAt: new Date().toISOString() },
            { text: 'User has been flagged for review twice this month. Monitor activity closely.', adminName: 'Admin_Sarah', createdAt: new Date().toISOString() },
          ],
        },
        activityLogs: [
          { icon: '✏️', iconColor: 'bg-primary-blue/20', title: 'Created new post', detail: 'Title: "General Discussion: API Update Issues"', type: 'post', ip: '192.168.1.42', device: 'Chrome / MacOS' },
          { icon: '💬', iconColor: 'bg-state-success/20', title: 'Commented on post', detail: 'Thread: "System Maintenance Scheduled"', type: 'comment', ip: '192.168.1.42', device: 'Chrome / MacOS' },
          { icon: '🔑', iconColor: 'bg-state-success/20', title: 'Successful Login', detail: 'Session started', type: 'login', ip: '192.168.1.42', device: 'Chrome / MacOS' },
          { icon: '⚠️', iconColor: 'bg-state-error/20', title: 'Content Reported', detail: 'Automated system flag: "Spam / Advertising"', type: 'post', ip: '10.0.0.5', device: 'System Bot' },
          { icon: '📝', iconColor: 'bg-primary-blue/20', title: 'Updated Profile Info', detail: 'Changed bio text', type: 'post', ip: '192.168.1.42', device: 'Chrome / MacOS' },
        ],
      },
      {
        user: {
          name: 'Kasun Perera',
          email: 'kasun@uom.lk',
          phone: '+94771234502',
          role: 'Student',
          status: 'Active',
          isOnline: true,
          lastActive: new Date(),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KasunPerera',
        },
        profile: {
          facultyName: 'Faculty of Engineering',
          tier: 'Standard',
          registrationNumber: 'UoC-2023-8842',
          joinDate: new Date('2022-03-15'),
          reputationScore: 500,
          adminNotes: [
            { text: 'No issues reported. Active and engaged user.', adminName: 'Admin_Alex', createdAt: new Date().toISOString() },
          ],
        },
        activityLogs: [
          { icon: '🔑', iconColor: 'bg-state-success/20', title: 'Successful Login', detail: 'Session started', type: 'login', ip: '192.168.2.10', device: 'Firefox / Windows' },
        ],
      },
      {
        user: {
          name: 'Achini Jayasuriya',
          email: 'achini@uom.lk',
          phone: '+94771234503',
          role: 'Student',
          status: 'Active',
          isOnline: false,
          lastActive: new Date(Date.now() - 86400000),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AchiniJay',
        },
        profile: {
          facultyName: 'Faculty of Science',
          tier: 'Premium',
          registrationNumber: 'SCI-2022-1104',
          joinDate: new Date('2022-06-20'),
          reputationScore: 500,
          adminNotes: [
            { text: 'One pending content review.', adminName: 'Admin_Sarah', createdAt: new Date().toISOString() },
          ],
        },
        activityLogs: [
          { icon: '💬', iconColor: 'bg-state-success/20', title: 'Commented on post', detail: 'Thread: "New Library Hours"', type: 'comment', ip: '192.168.3.55', device: 'Safari / iOS' },
        ],
      },
      {
        user: {
          name: 'Kaveesha Silva',
          email: 'kaveesha@uom.lk',
          phone: '+94771234504',
          role: 'Student',
          status: 'Active',
          isOnline: false,
          lastActive: new Date(Date.now() - 172800000),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KaveeshaSilva',
        },
        profile: {
          facultyName: 'Faculty of Management',
          tier: 'Standard',
          registrationNumber: 'MGT-2023-0571',
          joinDate: new Date('2023-01-10'),
          reputationScore: 500,
          adminNotes: [],
        },
        activityLogs: [],
      },
      {
        user: {
          name: 'Sarah Miller',
          email: 'sarah.m@unify.com',
          phone: '+94771234505',
          role: 'Student',
          status: 'Active',
          isOnline: true,
          lastActive: new Date(),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahMiller',
        },
        profile: {
          facultyName: 'Faculty of Engineering',
          tier: 'Standard',
          registrationNumber: 'ENG-23-012',
          joinDate: new Date('2023-04-12'),
          reputationScore: 500,
          adminNotes: [],
        },
        activityLogs: [],
      },
    ];

    for (const s of studentData) {
      const [user, created] = await User.findOrCreate({
        where: { email: s.user.email },
        defaults: { ...s.user, passwordHash: hashedPassword }
      });

      // Always update user status and online flag to ensure consistency
      await user.update({ 
        avatar: s.user.avatar, 
        status: s.user.status,
        isOnline: true // Force online for testing administrative actions like Logout
      });

      const faculty = faculties[s.profile.facultyName];
      
      // Sync StudentProfile (Create if missing, Update if exists)
      const [profile, profileCreated] = await StudentProfile.findOrCreate({
        where: { userId: user.id },
        defaults: {
          userId: user.id,
          facultyId: faculty?.id || null,
          universityId: uom.id,
          tier: s.profile.tier,
          registrationNumber: s.profile.registrationNumber,
          joinDate: s.profile.joinDate,
          reputationScore: 500,
          adminNotes: s.profile.adminNotes,
        }
      });

      if (!profileCreated) {
        await profile.update({
          facultyId: faculty?.id || null,
          reputationScore: 500,
          tier: s.profile.tier,
          registrationNumber: s.profile.registrationNumber,
        });
      }

      if (s.activityLogs.length > 0) {
        await UserActivityLog.destroy({ where: { userId: user.id } });
        await UserActivityLog.bulkCreate(
          s.activityLogs.map(log => ({ ...log, userId: user.id }))
        );
      }

      logger.info(`  ✅ Student '${s.user.name}' synced (Faculty: ${s.profile.facultyName})`);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 4: Business Users (matching frontend mockBusinessProfiles)
    // ═══════════════════════════════════════════════════════════════════════

    const businessData = [
      {
        user: {
          name: 'Coffee House',
          email: 'coffee@house.lk',
          phone: '+94112345678',
          role: 'Business',
          status: 'Active',
          isOnline: true,
          lastActive: new Date(),
          avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=CoffeeHouse',
        },
        profile: {
          displayName: 'Coffee House',
          businessName: 'Coffee House PVT LTD',
          category: 'FOOD',
          about: 'The best coffee in town, serving students with special discounts.',
          email: 'contact@coffeehouse.lk',
          phone: '+94 11 234 5678',
          website: 'www.coffeehouse.lk',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=CoffeeHouse',
          addresses: [{ type: 'Main', fullAddress: '45, Horton Place, Colombo 07, Sri Lanka', city: 'Colombo' }],
          averageRating: 4.7,
        },
        activityLogs: [
          { icon: '✏️', iconColor: 'bg-primary-blue/20', title: 'Menu Update', detail: 'Updated prices for "Student Combo Meal".', type: 'Update' },
          { icon: '💳', iconColor: 'bg-state-success/20', title: 'Invoice Paid', detail: 'Payment received for Q3 Advertising Slot.', type: 'Payment' },
        ],
      },
      {
        user: {
          name: 'TechFlow Solutions',
          email: 'contact@techflow.io',
          phone: '+94115678901',
          role: 'Business',
          status: 'Active',
          isOnline: false,
          lastActive: new Date(Date.now() - 3600000),
          avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechFlow',
        },
        profile: {
          displayName: 'TechFlow Solutions',
          businessName: 'TechFlow Solutions PVT LTD',
          category: 'SELF_EMPLOYED',
          about: 'Tech solutions and freelancing services for students.',
          email: 'contact@techflow.io',
          phone: '+94 11 567 8901',
          website: 'www.techflow.io',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechFlow',
          addresses: [{ type: 'Main', fullAddress: '12, Tech Park, Moratuwa, Sri Lanka', city: 'Moratuwa' }],
          averageRating: 4.3,
        },
        activityLogs: [
          { icon: '📢', iconColor: 'bg-state-warning/20', title: 'New Campaign', detail: 'Launched "Spring Discount" campaign.', type: 'Campaign' },
        ],
      },
      {
        user: {
          name: 'Urban Living',
          email: 'agents@urbanliving.net',
          phone: '+94113456789',
          role: 'Business',
          status: 'Active',
          isOnline: false,
          lastActive: new Date(Date.now() - 7200000),
          avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=UrbanLiving',
        },
        profile: {
          displayName: 'Urban Living',
          businessName: 'Urban Living Properties',
          category: 'BOARDING',
          about: 'Quality boarding houses near universities.',
          email: 'agents@urbanliving.net',
          phone: '+94 11 345 6789',
          website: 'www.urbanliving.net',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=UrbanLiving',
          addresses: [{ type: 'Main', fullAddress: '78, Galle Road, Dehiwala, Sri Lanka', city: 'Dehiwala' }],
          averageRating: 4.2,
        },
        activityLogs: [
          { icon: '🏠', iconColor: 'bg-primary-accent/20', title: 'Listing Updated', detail: 'Added new boarding house in Katubedda.', type: 'Update' },
        ],
      },
      {
        user: {
          name: 'GreenLeaf Organics',
          email: 'hello@greenleaf.com',
          phone: '+94114567890',
          role: 'Business',
          status: 'Active',
          isOnline: true,
          lastActive: new Date(),
          avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=GreenLeaf',
        },
        profile: {
          displayName: 'GreenLeaf Organics',
          businessName: 'GreenLeaf Organics PVT LTD',
          category: 'FOOD',
          about: 'Fresh organic food and smoothies for the health-conscious campus.',
          email: 'hello@greenleaf.com',
          phone: '+94 11 456 7890',
          website: 'www.greenleaf.com',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=GreenLeaf',
          addresses: [{ type: 'Main', fullAddress: '22, Ward Place, Colombo 07, Sri Lanka', city: 'Colombo' }],
          averageRating: 4.7,
        },
        activityLogs: [
          { icon: '🍃', iconColor: 'bg-state-success/20', title: 'Menu Updated', detail: 'Added seasonal organic smoothies.', type: 'Update' },
        ],
      },
      {
        user: {
          name: 'University Chess Club',
          email: 'chess@uom.lk',
          phone: '+94112340000',
          role: 'Club',
          status: 'Active',
          isOnline: true,
          lastActive: new Date(),
          avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChessClub',
        },
        profile: {
          displayName: 'University Chess Club',
          businessName: 'UoM Chess Club',
          about: 'The official chess club of University of Moratuwa.',
          email: 'chess@uom.lk',
          phone: '+94 11 234 0000',
          website: 'www.uomchess.lk',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChessClub',
          addresses: [{ type: 'Main', fullAddress: 'University of Moratuwa, Katubedda, Sri Lanka', city: 'Moratuwa' }],
          averageRating: 4.8,
        },
        activityLogs: [
          { icon: '♟️', iconColor: 'bg-primary-blue/20', title: 'Tournament Created', detail: 'Annual Inter-University Chess Championship.', type: 'Event' },
        ],
      },
      {
        user: {
          name: 'Tech Solutions',
          email: 'tech@sol.lk',
          phone: '+94112341111',
          role: 'Business',
          status: 'Suspended',
          isOnline: true,
          lastActive: new Date(),
          avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechSolutions',
        },
        profile: {
          displayName: 'Tech Solutions',
          businessName: 'Tech Solutions PVT LTD',
          category: 'SELF_EMPLOYED',
          about: 'Innovative tech solutions for modern businesses.',
          email: 'contact@techsol.lk',
          phone: '+94 11 234 1111',
          website: 'www.techsol.lk',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechSolutions',
          addresses: [{ type: 'Main', fullAddress: '78, Innovation Way, Colombo 03, Sri Lanka', city: 'Colombo' }],
          averageRating: 4.5,
        },
        activityLogs: [],
      },
    ];

    for (const b of businessData) {
      const [user, created] = await User.findOrCreate({
        where: { email: b.user.email },
        defaults: { ...b.user, passwordHash: hashedPassword }
      });

      // Always sync user
      await user.update({ 
        isOnline: true, 
        status: b.user.status, 
        avatar: b.user.avatar,
        role: b.user.role // Ensure role is synced
      });

      if (user.role === 'Club') {
        const [profile, profileCreated] = await ClubProfile.findOrCreate({
          where: { userId: user.id },
          defaults: { 
            userId: user.id,
            clubName: b.profile.displayName,
            about: b.profile.about,
            email: b.profile.email,
            logo: b.profile.logo
          }
        });
        if (!profileCreated) {
          await profile.update({
            clubName: b.profile.displayName,
            about: b.profile.about,
            email: b.profile.email,
            logo: b.profile.logo
          });
        }
      } else {
        // Sync BusinessProfile
        const [profile, profileCreated] = await BusinessProfile.findOrCreate({
          where: { userId: user.id },
          defaults: { ...b.profile, userId: user.id }
        });

        if (!profileCreated) {
          await profile.update(b.profile);
        }
      }

      // Ensure Wallet
      await Wallet.findOrCreate({
        where: { userId: user.id },
        defaults: {
          userId: user.id,
          balance: Math.floor(Math.random() * 500000) + 50000,
          currency: 'LKR'
        }
      });

      if (b.activityLogs.length > 0) {
        await UserActivityLog.destroy({ where: { userId: user.id } });
        await UserActivityLog.bulkCreate(b.activityLogs.map(log => ({ ...log, userId: user.id })));
      }

      logger.info(`  ✅ Business synced: ${b.user.name} (${b.profile.category})`);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 4.5: Boost Packages
    // ═══════════════════════════════════════════════════════════════════════

    logger.info('Seeding boost packages...');
    await BoostPackage.bulkCreate([
      { id: 'Premium', name: 'Premium Pack', price: 50000, durationValue: 30, durationUnit: 'Days', status: 'live' },
      { id: 'Standard', name: 'Standard Pack', price: 20000, durationValue: 14, durationUnit: 'Days', status: 'live' },
      { id: 'Starter', name: 'Starter Pack', price: 5000, durationValue: 3, durationUnit: 'Days', status: 'live' }
    ], { ignoreDuplicates: true });

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 5: Business Analytics (Transactions & Campaigns)
    // ═══════════════════════════════════════════════════════════════════════

    logger.info('Seeding business analytics data...');
    const coffee = await User.findOne({ where: { email: 'coffee@house.lk' } });
    if (coffee) {
      const wallet = await Wallet.findOne({ where: { userId: coffee.id } });
      if (wallet) {
        // Clean old transactions
        await Transaction.destroy({ where: { walletId: wallet.id } });
        
        // This month transactions
        await Transaction.bulkCreate([
          { walletId: wallet.id, type: 'CREDIT', category: 'Biz Boosts', amount: 1500000, status: 'COMPLETED', createdAt: new Date() },
          { walletId: wallet.id, type: 'CREDIT', category: 'Merchandise', amount: 800000, status: 'COMPLETED', createdAt: new Date() }
        ]);

        // Last month transactions (for trend)
        const lastMonth = moment().subtract(1, 'month').toDate();
        await Transaction.bulkCreate([
          { walletId: wallet.id, type: 'CREDIT', category: 'Biz Boosts', amount: 1200000, status: 'COMPLETED', createdAt: lastMonth },
          { walletId: wallet.id, type: 'CREDIT', category: 'Merchandise', amount: 700000, status: 'COMPLETED', createdAt: lastMonth }
        ]);
      }

      // Clean old campaigns
      await BoostCampaign.destroy({ where: { userId: coffee.id } });
      const samplePost = await Post.findOne();
      const validPostId = samplePost ? samplePost.id : null;
      
      if (validPostId) {
        await BoostCampaign.bulkCreate([
          { 
            campaignId: 'CAMP-2026-001', userId: coffee.id, postId: validPostId, packageId: 'Premium', 
            name: 'Summer Sale', status: 'Active', budget: 50000, subtotal: 45000, total: 50000,
            durationDays: 30, startDate: new Date(), createdAt: new Date()
          },
          { 
            campaignId: 'CAMP-2026-002', userId: coffee.id, postId: validPostId, packageId: 'Standard', 
            name: 'New Item Promo', status: 'Active', budget: 20000, subtotal: 18000, total: 20000,
            durationDays: 14, startDate: new Date(), createdAt: new Date()
          }
        ]);
      }
      logger.info(`  ✅ Business analytics seeded for Coffee House`);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 6: Student Activity Stats (Posts, Comments, Reports)
    // ═══════════════════════════════════════════════════════════════════════

    logger.info('Seeding student activity stats...');
    const alex = await User.findOne({ where: { email: 'alex.j@unify.com' } });
    if (alex) {
      // Clean up old mock data first if re-running
      await Post.destroy({ where: { authorId: alex.id } });
      await Comment.destroy({ where: { userId: alex.id } });
      await StudentReport.destroy({ where: { studentId: alex.id } });

      const postsToCreate = Array(1240).fill(null).map((_, i) => ({
        authorId: alex.id,
        title: `Sample Post ${i}`,
        content: 'Populating database counts...',
        status: 'Active',
      }));
      await Post.bulkCreate(postsToCreate);

      // Create last month's posts for trend
      const lastMonth = moment().subtract(1, 'month').toDate();
      await Post.bulkCreate(Array(1100).fill(null).map((_, i) => ({
        authorId: alex.id,
        title: `Old Post ${i}`,
        content: 'Historical data...',
        status: 'Active',
        createdAt: lastMonth
      })));
      
      const commentsToCreate = Array(3500).fill(null).map((_, i) => ({
        userId: alex.id,
        postId: null, 
        content: 'Test comment'
      }));
      await Comment.bulkCreate(commentsToCreate);

      // Create last month's comments for trend
      await Comment.bulkCreate(Array(3300).fill(null).map((_, i) => ({
        userId: alex.id,
        postId: null, 
        content: 'Old comment',
        createdAt: lastMonth
      })));

      await StudentReport.bulkCreate([
        { 
          reportId: `RPT-2026-${Math.floor(Math.random() * 9000) + 1000}`,
          studentId: alex.id, 
          reportType: 'user',
          category: 'harassment',
          title: 'Report: Harassment on User',
          reportedEntityId: `USER-${alex.id}`,
          status: 'Pending Review', 
          priority: 'Medium'
        },
        { 
          reportId: `RPT-2026-${Math.floor(Math.random() * 9000) + 1000}`,
          studentId: alex.id, 
          reportType: 'post',
          category: 'spam',
          title: 'Report: Spam on Post',
          reportedEntityId: 'POST-001',
          status: 'Pending Review', 
          priority: 'High'
        }
      ]);
      logger.info(`  ✅ Activity stats seeded for Alex Johnson (1240 Posts, 3500 Comments, 2 Reports)`);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 6: Transactions (for Business Stats)
    // ═══════════════════════════════════════════════════════════════════════

    logger.info('Seeding transactions...');
    const businesses = await User.findAll({ where: { role: 'Business' } });
    const wallets = await Wallet.findAll({ where: { userId: businesses.map(b => b.id) } });

    const transactions = [];
    const now = new Date();
    const lastMonth = moment().subtract(1, 'month').toDate();

    for (const wallet of wallets) {
      // Last month transactions
      for (let i = 0; i < 3; i++) {
        transactions.push({
          walletId: wallet.id,
          amount: Math.floor(Math.random() * 5000) + 2000,
          type: 'CREDIT',
          status: 'COMPLETED',
          description: 'Boost Package Purchase',
          createdAt: lastMonth
        });
      }
      // This month transactions
      for (let i = 0; i < 4; i++) {
        transactions.push({
          walletId: wallet.id,
          amount: Math.floor(Math.random() * 6000) + 3000,
          type: 'CREDIT',
          status: 'COMPLETED',
          description: 'Premium Boost Purchase',
          createdAt: now
        });
      }
    }

    await Transaction.destroy({ where: {} }); // Clear old transactions for clean stats
    await Transaction.bulkCreate(transactions);
    logger.info(`  ✅ ${transactions.length} Transactions seeded for businesses`);

    logger.info('\n🎉 All admin management seed data created successfully!');
    process.exit(0);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      logger.error('❌ Validation Error:', error.errors.map(e => `${e.path}: ${e.message}`));
    } else {
      logger.error('❌ Error:', error.message);
      logger.error(error.stack);
    }
    process.exit(1);
  }
}

seedAdminData();
