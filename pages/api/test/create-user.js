import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      return res.status(200).json({ 
        message: 'Test user already exists', 
        user: {
          name: existingUser.name,
          email: existingUser.email
        }
      });
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      hashedPassword,
    });

    await testUser.save();

    res.status(201).json({ 
      message: 'Test user created successfully',
      user: {
        name: testUser.name,
        email: testUser.email
      }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} 