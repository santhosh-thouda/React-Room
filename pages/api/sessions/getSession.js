// pages/api/getSession.js

import dbConnect from '@/components/lib/mongodb';
import Session from '@/models/Session';

export default async function handler(req, res) {
  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ message: 'Missing sessionId' });
  }

  await dbConnect();

  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    res.status(200).json({ chatHistory: session.chatHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching session' });
  }
}
