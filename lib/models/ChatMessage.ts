import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  userId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  crisisDetected: boolean;
  crisisLevel?: 'low' | 'moderate' | 'high' | 'imminent';
  language: string;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  crisisDetected: {
    type: Boolean,
    default: false,
  },
  crisisLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'imminent'],
  },
  language: {
    type: String,
    default: 'en',
  },
}, {
  timestamps: false,
});

// Index for efficient queries
ChatMessageSchema.index({ userId: 1, timestamp: -1 });
ChatMessageSchema.index({ crisisDetected: 1, crisisLevel: 1 });

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
