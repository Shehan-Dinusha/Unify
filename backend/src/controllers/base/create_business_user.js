import { User, BusinessProfile, Wallet, UserActivityLog, BoostCampaign } from './src/modules/index.js';
import bcrypt from 'bcryptjs';
import logger from '../../../utils/logger.js';

async function createBusinessUser() {
  try {
    const email = 'coffee@house.lk';
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create User
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        name: 'Coffee House',
        email: email,
        passwordHash: hashedPassword,
        role: 'Business',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop'
      }
    });

    if (!created) {
      logger.info('ℹ️ Business User already exists');
      process.exit(0);
    }

    // 2. Create Business Profile
    await BusinessProfile.create({
      userId: user.id,
      displayName: 'Coffee House',
      businessName: 'Coffee House PVT LTD',
      category: 'FOOD',
      about: 'The best coffee in town, serving students with special discounts.',
      email: 'contact@coffeehouse.lk',
      phone: '+94 11 234 5678',
      website: 'www.coffeehouse.lk',
      addresses: [{
        type: 'Main',
        fullAddress: '45, Horton Place, Colombo 07, Sri Lanka',
        city: 'Colombo'
      }],
      averageRating: 4.7
    });

    // 3. Create Wallet
    await Wallet.create({
      userId: user.id,
      balance: 150000.00,
      currency: 'LKR'
    });

    // 4. Create Mock Activity Logs
    await UserActivityLog.bulkCreate([
      {
        userId: user.id,
        icon: '📝',
        title: 'Menu Updated',
        detail: 'Updated prices for Student Combo Meal.',
        type: 'Update'
      },
      {
        userId: user.id,
        icon: '💳',
        title: 'Invoice Paid',
        detail: 'Payment received for QS Advertising Slot.',
        type: 'Payment'
      }
    ]);

    // 5. Create a Mock Boost Campaign
    await BoostCampaign.create({
      campaignId: '#Campaign-7721-C',
      userId: user.id,
      postId: 1, // Assumes a post exists
      packageId: 1,
      name: 'Coffee Promo',
      status: 'Active',
      budget: 5000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      paymentStatus: 'completed'
    });

    logger.info(`✅ Business User 'Coffee House' created successfully with ID: ${user.id}`);
    process.exit(0);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      logger.error('❌ Validation Error Details:', error.errors.map(e => `${e.path}: ${e.message}`));
    } else {
      logger.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

createBusinessUser();
