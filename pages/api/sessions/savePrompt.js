import dbConnect from '@/components/lib/mongodb';
import Prompt from '@/models/Prompt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt, code } = req.body;

  if (!prompt || !code) {
    return res.status(400).json({ message: 'Prompt and code are required' });
  }

  try {
    await dbConnect();
    const existing = await Prompt.findOne({ prompt });

    if (existing) {
      existing.code = code;
      await existing.save();
      return res.status(200).json({ message: 'Prompt updated', prompt: existing });
    }

    const newPrompt = new Prompt({ prompt, code });
    await newPrompt.save();
    res.status(201).json({ message: 'Prompt saved', prompt: newPrompt });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
