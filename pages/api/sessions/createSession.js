// pages/api/createSession.js

import dbConnect from '@/components/lib/mongodb';
import Session from '@/models/Session';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, name } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  await dbConnect();

  try {
    let sessionName = name;

    // If no name is provided, auto-generate a unique name based on today's date
    if (!sessionName) {
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-US'); // e.g., "7/28/2025"

      const regex = new RegExp(`^Session ${dateStr}( \\d+)?$`, 'i');
      const sessionsToday = await Session.find({ userId, name: { $regex: regex } });

      const nextNum = sessionsToday.length + 1;
      sessionName = `Session ${dateStr}${nextNum > 1 ? ` ${nextNum}` : ''}`;
    }

    const newSession = new Session({
      userId,
      name: sessionName,
      chatHistory: [],
    });

    await newSession.save();
    res.status(201).json({ message: 'Session created', session: newSession });

  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}
