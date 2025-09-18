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

    const entries = await MoodEntry.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error('Get mood entries error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { mood, activities, notes, tags } = await request.json();

    if (!mood || mood < 1 || mood > 5) {
      return NextResponse.json(
        { message: 'Valid mood value (1-5) is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const moodEntry = new MoodEntry({
      userId: decoded.userId,
      mood,
      activities: activities || [],
      notes: notes || '',
      tags: tags || [],
    });

    await moodEntry.save();

    return NextResponse.json(moodEntry, { status: 201 });
  } catch (error) {
    console.error('Create mood entry error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
