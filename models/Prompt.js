import mongoose from 'mongoose';

const PromptSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    jsx: { type: String, default: '' },
    css: { type: String, default: '' },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

PromptSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Prompt || mongoose.model('Prompt', PromptSchema);
