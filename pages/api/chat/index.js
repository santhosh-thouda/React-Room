import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/mongodb';
import Session from '../../../models/Session';
import { GoogleGenerativeAI } from "@google/generative-ai";
const formidable = require('formidable');

async function generateComponent(prompt) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Using gemini-1.5-flash as a commonly available model.
    // In a production environment, you should verify available models via ListModels API.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    const systemPrompt = `You are an expert React component generator. Generate clean, modern React components with CSS.

Rules:
- Return only valid JSX/TSX and CSS
- Use modern CSS with flexbox/grid
- Make components responsive
- Use semantic HTML
- Include hover states and transitions
- Return in this exact format:

JSX:
<your jsx code here>

CSS:
<your css code here>`;

    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    const response = await result.response;
    const text = await response.text();

    const jsxMatch = text.match(/JSX:\s*([\s\S]*?)(?=CSS:|$)/);
    const cssMatch = text.match(/CSS:\s*([\s\S]*?)$/);

    return {
      jsx: jsxMatch ? jsxMatch[1].trim() : "",
      css: cssMatch ? cssMatch[1].trim() : "",
    };
  } catch (err) {
    console.error("Gemini API error:", err);
    throw new Error("Gemini API error: " + (err.message || err.toString()));
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(400).json({ error: 'Error parsing form data' });
    }

    // Formidable parses fields as arrays, so ensure they are converted to strings
    const message = Array.isArray(fields.message) ? fields.message[0] : fields.message;
    const sessionId = Array.isArray(fields.sessionId) ? fields.sessionId[0] : fields.sessionId;
    const imageFile = files.image && Array.isArray(files.image) ? files.image[0] : files.image;

    if (!message && !imageFile) {
      return res.status(400).json({ error: 'Message or image is required' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();

    const sessionData = await Session.findOne({
      _id: sessionId,
      userId: session.user.id,
    });

    if (!sessionData) {
      return res.status(404).json({ error: 'Session not found' });
    }

    let imageUrl = null;
    if (imageFile) {
      // Placeholder for actual image upload logic (e.g., to S3, Cloudinary).
      // For now, it will just acknowledge the presence of an image and provide a mock URL.
      console.log(`Image received: ${imageFile.filepath}`);
      imageUrl = `/uploads/${imageFile.newFilename}`; // Example placeholder URL
    }

    // Generate AI component
    const generatedCode = await generateComponent(message, imageUrl);

    const newChatMessage = {
      role: 'user',
      content: message, // 'message' is now guaranteed to be a string
      timestamp: new Date(),
      image: imageUrl,
    };

    sessionData.chatHistory.push(newChatMessage);
    sessionData.currentCode = generatedCode;
    sessionData.updatedAt = new Date();

    await sessionData.save();

    // Compose AI message for chat
    const aiMessage = {
      role: 'assistant',
      content: message, // Echo the user's prompt
      code: generatedCode,
      timestamp: new Date(),
    };

    res.status(200).json({
      message: 'Component generated successfully',
      code: generatedCode,
      aiMessage,
    });
  });
}


