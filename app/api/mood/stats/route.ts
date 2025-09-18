import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import MoodEntry from '@/lib/models/MoodEntry';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No authentication token' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      email: string;
    };

    await connectDB();

    const userId = decoded.userId;

    // Get all mood entries
    const entries = await MoodEntry.find({ userId }).sort({ createdAt: -1 });

    // Calculate average mood
    const averageMood = entries.length > 0 
      ? entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length 
      : 0;

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].createdAt);
      entryDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    const stats = {
      averageMood,
      totalEntries: entries.length,
      streak,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Get mood stats error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
