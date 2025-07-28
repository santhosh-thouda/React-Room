import dbConnect from '@/components/lib/mongodb';
import Prompt from '@/models/Prompt';

export default async function handler(req, res) {
  const { prompt } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    await dbConnect();
    const data = await Prompt.findOne({ prompt });

    if (!data) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    res.status(200).json({ prompt: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
