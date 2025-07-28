import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/mongodb';
import Session from '../../../models/Session';
import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Enhanced authentication check
  if (!session?.user?.id) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'You must be signed in to access this resource' 
    });
  }

  const { id } = req.query;

  // Improved ID validation
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ 
      error: 'Invalid Session ID',
      message: 'Please provide a valid session ID' 
    });
  }

  await dbConnect();

  try {
    switch (req.method) {
      case 'GET':
        return handleGetRequest(id, session.user.id, res);
      case 'PUT':
        return handlePutRequest(id, session.user.id, req.body, res);
      case 'DELETE':
        return handleDeleteRequest(id, session.user.id, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({
          error: 'Method Not Allowed',
          message: `Method ${req.method} is not supported for this endpoint`
        });
    }
  } catch (error) {
    console.error(`API Error (${req.method}):`, error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
}

// Handler functions separated for better readability
async function handleGetRequest(id, userId, res) {
  const sessionData = await Session.findOne({
    _id: id,
    userId
  }).lean();

  if (!sessionData) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'The requested session does not exist or you do not have access'
    });
  }

  // Sanitize data before sending
  const { chatHistory, currentCode, name, createdAt, updatedAt } = sessionData;
  return res.status(200).json({ 
    session: { chatHistory, currentCode, name, createdAt, updatedAt }
  });
}

async function handlePutRequest(id, userId, body, res) {
  const { chatHistory, currentCode, name } = body;

  // Validate input
  if (!chatHistory && !currentCode && !name) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'At least one field (chatHistory, currentCode, or name) must be provided'
    });
  }

  const updateData = { 
    ...(chatHistory && { chatHistory }),
    ...(currentCode && { currentCode }),
    ...(name && { name }),
    updatedAt: new Date()
  };

  const updatedSession = await Session.findOneAndUpdate(
    { _id: id, userId },
    updateData,
    { new: true, lean: true }
  );

  if (!updatedSession) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Session not found or you do not have permission to update it'
    });
  }

  return res.status(200).json({ 
    session: updatedSession,
    message: 'Session updated successfully'
  });
}

async function handleDeleteRequest(id, userId, res) {
  const deletedSession = await Session.findOneAndDelete({
    _id: id,
    userId
  });

  if (!deletedSession) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Session not found or you do not have permission to delete it'
    });
  }

  return res.status(200).json({ 
    message: 'Session deleted successfully',
    deletedId: id
  });
}