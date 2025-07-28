import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/mongodb';
import Session from '../../../models/Session';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const sessions = await Session.find({ userId: session.user.id })
        .sort({ updatedAt: -1 })
        .select('name createdAt updatedAt');

      res.status(200).json({ sessions });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name } = req.body;
      
      const newSession = new Session({
        userId: session.user.id,
        name: name || `Session ${new Date().toLocaleDateString()}`,
      });

      const savedSession = await newSession.save();
      res.status(201).json(savedSession);
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 