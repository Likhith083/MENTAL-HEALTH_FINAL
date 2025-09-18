import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
    accessibility: {
      largeText: boolean;
      highContrast: boolean;
      dyslexiaFont: boolean;
      reduceMotion: boolean;
    };
    privacy: {
      aiConsent: boolean;
      dataSharing: boolean;
      crisisLogging: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    language: {
      type: String,
      default: 'en',
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
    accessibility: {
      largeText: {
        type: Boolean,
        default: false,
      },
      highContrast: {
        type: Boolean,
        default: false,
      },
      dyslexiaFont: {
        type: Boolean,
        default: false,
      },
      reduceMotion: {
        type: Boolean,
        default: false,
      },
    },
    privacy: {
      aiConsent: {
        type: Boolean,
        default: true,
      },
      dataSharing: {
        type: Boolean,
        default: false,
      },
      crisisLogging: {
        type: Boolean,
        default: true,
      },
    },
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
