import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    default: 'Untitled Session',
  },
  chatHistory: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String, // URL to uploaded image
    },
    code: {
      jsx: {
        type: String,
        default: '',
      },
      css: {
        type: String,
        default: '',
      },
    },
  }],
  currentCode: {
    jsx: {
      type: String,
      default: '',
    },
    css: {
      type: String,
      default: '',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
SessionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Session || mongoose.model('Session', SessionSchema); 