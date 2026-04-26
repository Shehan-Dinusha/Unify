import User from './src/modules/User.model.js';

async function createTestUser() {
  try {
    const [user, created] = await User.findOrCreate({
      where: { id: 1 },
      defaults: {
        id: 1,
        name: 'Test Student',
        email: 'test@example.com',
        passwordHash: 'hashed_password_placeholder', // The model uses passwordHash, not password
        role: 'Student',
        status: 'Active'
      }
    });

    if (created) {
      console.log('✅ Test User created successfully with ID: 1');
    } else {
      console.log('ℹ️ Test User already exists with ID: 1');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  }
}

createTestUser();
