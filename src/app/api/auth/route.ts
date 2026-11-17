import { NextRequest, NextResponse } from 'next/server';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: 'google' | 'apple' | 'microsoft' | 'github' | 'email';
  createdAt: string;
}

// In-memory / mock database for demonstration & local storage sync
const MOCK_USERS: Record<string, AuthUser> = {
  'sudarshan.architect@gmail.com': {
    id: 'usr_sudarshan_01',
    name: 'Sudarshan Mehta',
    email: 'sudarshan.architect@gmail.com',
    avatarUrl: '/icon-192.png',
    provider: 'google',
    createdAt: new Date().toISOString(),
  },
  'demo@nimora.ai': {
    id: 'usr_demo_02',
    name: 'Alex Rivera',
    email: 'demo@nimora.ai',
    avatarUrl: '/icon-192.png',
    provider: 'email',
    createdAt: new Date().toISOString(),
  },
};

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 }
    );
  }

  const token = authHeader.replace('Bearer ', '');
  return NextResponse.json({
    authenticated: true,
    user: MOCK_USERS['sudarshan.architect@gmail.com'],
    token,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, name, provider, token } = body;

    // 1. Social OAuth (Google, Apple, Microsoft, GitHub)
    if (action === 'social_auth') {
      const selectedProvider = (provider || 'google').toLowerCase();
      
      const socialUser: AuthUser = {
        id: `usr_${selectedProvider}_${Date.now().toString(36)}`,
        name: name || (selectedProvider === 'google' ? 'Google Executive User' : 'Apple Executive User'),
        email: email || `user@${selectedProvider}-auth.nimora.internal`,
        avatarUrl: '/icon-192.png',
        provider: selectedProvider as AuthUser['provider'],
        createdAt: new Date().toISOString(),
      };

      const authToken = `jwt_nimora_${selectedProvider}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      return NextResponse.json({
        success: true,
        message: `Successfully authenticated via ${selectedProvider.toUpperCase()} OAuth`,
        user: socialUser,
        token: authToken,
        expiresIn: 30 * 24 * 60 * 60, // 30 days
      });
    }

    // 2. Email & Password Login
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: 'Email and password are required.' },
          { status: 400 }
        );
      }

      // Check format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 6 characters long.' },
          { status: 400 }
        );
      }

      const existingUser = MOCK_USERS[email.toLowerCase()] || {
        id: `usr_email_${Date.now().toString(36)}`,
        name: email.split('@')[0],
        email: email.toLowerCase(),
        provider: 'email',
        createdAt: new Date().toISOString(),
      };

      const authToken = `jwt_nimora_email_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: existingUser,
        token: authToken,
        expiresIn: 30 * 24 * 60 * 60,
      });
    }

    // 3. Email & Password Sign Up
    if (action === 'signup') {
      if (!email || !password || !name) {
        return NextResponse.json(
          { success: false, error: 'Name, email, and password are required.' },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }

      if (password.length < 8) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 8 characters long.' },
          { status: 400 }
        );
      }

      const newUser: AuthUser = {
        id: `usr_new_${Date.now().toString(36)}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        provider: 'email',
        createdAt: new Date().toISOString(),
      };

      const authToken = `jwt_nimora_signup_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      return NextResponse.json({
        success: true,
        message: 'Account created successfully. Welcome to NIMORA.',
        user: newUser,
        token: authToken,
        expiresIn: 30 * 24 * 60 * 60,
      });
    }

    // 4. Password Recovery / Forgot Password
    if (action === 'forgot_password') {
      if (!email) {
        return NextResponse.json(
          { success: false, error: 'Email is required to send recovery link.' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Password reset instructions have been dispatched to ${email}. Please check your inbox.`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid authentication action specified.' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Authentication service error.' },
      { status: 500 }
    );
  }
}
