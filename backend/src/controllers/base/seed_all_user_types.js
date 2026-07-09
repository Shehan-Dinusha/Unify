import {
  User,
  StudentProfile,
  BusinessProfile,
  ClubProfile,
  University,
  Faculty,
  Wallet
} from '../../modules/index.js';
import bcrypt from 'bcryptjs';
import logger from "../../utils/logger.js";
import { sendResponse } from "../../utils/response.js";

export const seedAllUserTypes = async (req, res) => {
  try {
    const defaultPassword = await bcrypt.hash('password123', 10);

    logger.info('Starting to seed all user types...');

    // 0. Ensure University and Faculty exist for students
    const [university] = await University.findOrCreate({
      where: { name: 'University of Moratuwa' },
      defaults: { name: 'University of Moratuwa' }
    });

    const [faculty] = await Faculty.findOrCreate({
      where: { name: 'Faculty of Engineering' },
      defaults: { universityId: university.id, name: 'Faculty of Engineering' }
    });

    // 1. Student User
    logger.info('Creating Student User...');
    const [studentUser] = await User.findOrCreate({
      where: { email: 'student@unify.com' },
      defaults: {
        name: 'Regular Student',
        email: 'student@unify.com',
        passwordHash: defaultPassword,
        role: 'Student',
        status: 'Active',
      }
    });
    await StudentProfile.findOrCreate({
      where: { userId: studentUser.id },
      defaults: {
        userId: studentUser.id,
        facultyId: faculty.id,
        isBatchRep: false,
        registrationNumber: 'ENG/2021/002',
      }
    });
    logger.info(`Student created: ${studentUser.email} (password123)`);

    // 2. BatchRep User
    logger.info('Creating BatchRep User...');
    const [batchRepUser] = await User.findOrCreate({
      where: { email: 'batchrep@unify.com' },
      defaults: {
        name: 'Batch Representative',
        email: 'batchrep@unify.com',
        passwordHash: defaultPassword,
        role: 'Student',
        status: 'Active',
      }
    });
    await StudentProfile.findOrCreate({
      where: { userId: batchRepUser.id },
      defaults: {
        userId: batchRepUser.id,
        facultyId: faculty.id,
        isBatchRep: true,
        registrationNumber: 'ENG/2021/003',
      }
    });
    logger.info(`BatchRep created: ${batchRepUser.email} (password123)`);

    // 3. Club User
    logger.info('Creating Club User...');
    const [clubUser] = await User.findOrCreate({
      where: { email: 'club@unify.com' },
      defaults: {
        name: 'Leo Club Admin',
        email: 'club@unify.com',
        passwordHash: defaultPassword,
        role: 'Club',
        status: 'Active',
      }
    });
    await ClubProfile.findOrCreate({
      where: { userId: clubUser.id },
      defaults: {
        userId: clubUser.id,
        clubName: 'Leo Club of UoM',
        about: 'Leadership, Experience, Opportunity.',
        email: 'contact@leouom.com',
        isVerified: true
      }
    });
    await Wallet.findOrCreate({
      where: { userId: clubUser.id },
      defaults: { userId: clubUser.id, balance: 50000.00, currency: 'LKR' }
    });
    logger.info(`Club created: ${clubUser.email} (password123)`);

    // 4. Business (Food)
    logger.info('Creating Business (Food) User...');
    const [foodUser] = await User.findOrCreate({
      where: { email: 'food@unify.com' },
      defaults: {
        name: 'Taste Bud Cafe',
        email: 'food@unify.com',
        passwordHash: defaultPassword,
        role: 'Business',
        status: 'Active',
      }
    });
    await BusinessProfile.findOrCreate({
      where: { userId: foodUser.id },
      defaults: {
        userId: foodUser.id,
        displayName: 'Taste Bud Cafe',
        category: 'FOOD',
        about: 'Delicious meals for students.',
      }
    });
    await Wallet.findOrCreate({
      where: { userId: foodUser.id },
      defaults: { userId: foodUser.id, balance: 10000.00, currency: 'LKR' }
    });
    logger.info(`Food Business created: ${foodUser.email} (password123)`);

    // 5. Business (Self Employed)
    logger.info('Creating Business (Self Employed) User...');
    const [selfEmployedUser] = await User.findOrCreate({
      where: { email: 'selfemployed@unify.com' },
      defaults: {
        name: 'Alex Tutoring',
        email: 'selfemployed@unify.com',
        passwordHash: defaultPassword,
        role: 'Business',
        status: 'Active',
      }
    });
    await BusinessProfile.findOrCreate({
      where: { userId: selfEmployedUser.id },
      defaults: {
        userId: selfEmployedUser.id,
        displayName: 'Alex Tutoring',
        category: 'SELF_EMPLOYED',
        about: 'Expert tutoring for math and physics.',
      }
    });
    await Wallet.findOrCreate({
      where: { userId: selfEmployedUser.id },
      defaults: { userId: selfEmployedUser.id, balance: 5000.00, currency: 'LKR' }
    });
    logger.info(`Self Employed Business created: ${selfEmployedUser.email} (password123)`);

    // 6. Business (Boarding)
    logger.info('Creating Business (Boarding) User...');
    const [boardingUser] = await User.findOrCreate({
      where: { email: 'boarding@unify.com' },
      defaults: {
        name: 'Cozy Boarding House',
        email: 'boarding@unify.com',
        passwordHash: defaultPassword,
        role: 'Business',
        status: 'Active',
      }
    });
    await BusinessProfile.findOrCreate({
      where: { userId: boardingUser.id },
      defaults: {
        userId: boardingUser.id,
        displayName: 'Cozy Boarding House',
        category: 'BOARDING',
        about: 'Affordable boarding near the university.',
      }
    });
    await Wallet.findOrCreate({
      where: { userId: boardingUser.id },
      defaults: { userId: boardingUser.id, balance: 25000.00, currency: 'LKR' }
    });
    logger.info(`Boarding Business created: ${boardingUser.email} (password123)`);

    logger.info('All users created successfully!');
    return sendResponse(res, 200, true, 'All users created successfully!');

  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      logger.error('Validation Error Details:', error.errors.map(e => `${e.path}: ${e.message}`));
    } else {
      logger.error('Error:', error.message);
    }
    return sendResponse(res, 500, false, error.message);
  }
};
