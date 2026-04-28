import { User, StudentProfile, UserActivityLog, Faculty, University } from './src/modules/index.js';
import bcrypt from 'bcryptjs';

async function createStudentUser() {
  try {
    const email = 'alex.j@unify.com';
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 0. Ensure a University exists
    const [university] = await University.findOrCreate({
      where: { name: 'University of Moratuwa' },
      defaults: { name: 'University of Moratuwa' }
    });

    // 1. Ensure a Faculty exists
    const [faculty] = await Faculty.findOrCreate({
      where: { name: 'Faculty of Engineering' },
      defaults: { universityId: university.id, name: 'Faculty of Engineering' }
    });

    // 2. Create User
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        name: 'Alex Johnson',
        email: email,
        passwordHash: hashedPassword,
        role: 'Student',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
      }
    });

    if (!created) {
      console.log('ℹ️ Student User already exists');
      process.exit(0);
    }

    // 3. Create Student Profile
    await StudentProfile.create({
      userId: user.id,
      facultyId: faculty.id,
      tier: 'Premium',
      registrationNumber: 'ENG/2021/001',
      adminNotes: [
        {
          text: "User has been flagged for review twice this month. Monitor activity closely.",
          adminName: "Admin_Sarah",
          createdAt: new Date().toISOString()
        }
      ]
    });

    // 4. Create Mock Activity Logs
    await UserActivityLog.bulkCreate([
      {
        userId: user.id,
        icon: '🖊️',
        title: 'Created new post',
        detail: 'Title: General Discussion: API Update Issues',
        type: 'Post',
        ip: '192.168.1.42',
        device: 'Chrome / MacOS'
      },
      {
        userId: user.id,
        icon: '💬',
        title: 'Commented on post',
        detail: 'Thread: System Maintenance Scheduled',
        type: 'Comment',
        ip: '192.168.1.42',
        device: 'Chrome / MacOS'
      },
      {
        userId: user.id,
        icon: '🔑',
        title: 'Successful Login',
        detail: 'Session started',
        type: 'Login',
        ip: '192.168.1.42',
        device: 'Chrome / MacOS'
      }
    ]);

    console.log(`✅ Student User 'Alex Johnson' created successfully with ID: ${user.id}`);
    process.exit(0);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      console.error('❌ Validation Error Details:', error.errors.map(e => `${e.path}: ${e.message}`));
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

createStudentUser();
