import Post from './src/modules/Post.model.js';

async function createTestPost() {
  try {
    const [post, created] = await Post.findOrCreate({
      where: { id: 1 },
      defaults: {
        id: 1,
        authorId: 1, // Links to the Test User created by create_user.js
        title: 'Summer Sale Campaign #4',
        description: "Promoting the new 'AirStride' collection with a 20% discount code. Targeting active runners aged 25-35 in metropolitan areas.",
        type: 'Business',
        isPromoted: false,
        likesCount: 0,
      }
    });

    if (created) {
      console.log('✅ Test Post created successfully with ID: 1');
    } else {
      console.log('ℹ️ Test Post already exists with ID: 1');
    }

    // Create a second post for additional testing
    const [post2, created2] = await Post.findOrCreate({
      where: { id: 2 },
      defaults: {
        id: 2,
        authorId: 1,
        title: 'Summer Tech Sale – 50% Off',
        description: 'Get the latest gadgets at half price. Limited time offer for university students.',
        type: 'Business',
        isPromoted: false,
        likesCount: 0,
      }
    });

    if (created2) {
      console.log('✅ Test Post created successfully with ID: 2');
    } else {
      console.log('ℹ️ Test Post already exists with ID: 2');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating post:', error.message);
    process.exit(1);
  }
}

createTestPost();
