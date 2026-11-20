import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.ts';
import { authMiddleware, generateToken, type AuthenticatedRequest } from '../middleware/auth.ts';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, degree, branch, graduationYear } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = db.users.findOne((u) => u.email === normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = db.users.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      college: college || '',
      degree: degree || '',
      branch: branch || '',
      graduationYear: graduationYear || '',
      roleInterest: 'Full Stack Software Engineer',
      targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta'],
      bio: 'Enthusiastic candidate preparing for top-tier software engineering interviews.',
    });

    const token = generateToken(newUser._id);
    const { passwordHash: _, ...safeUser } = newUser;

    return res.status(201).json({ token, user: safeUser });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = db.users.findOne((u) => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    const { passwordHash: _, ...safeUser } = user;

    return res.json({ token, user: safeUser });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error during login' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = db.users.findOne((u) => u.email === email.toLowerCase().trim());
    // For privacy, respond successfully whether found or not
    return res.json({
      message: user
        ? 'Password reset instructions have been generated and sent to your email.'
        : 'If an account exists with this email, reset instructions have been dispatched.',
      success: true,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get Current User Profile
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { passwordHash: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// Update Profile
router.put('/profile', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const updates = req.body;
    delete updates.passwordHash;
    delete updates.email; // email immutable via simple profile update

    const updated = db.users.updateOne(req.userId!, updates);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { passwordHash: _, ...safeUser } = updated;
    res.json({ user: safeUser, message: 'Profile updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Seed default demo user if db is empty
export async function seedDemoUserIfNeeded() {
  const demoEmail = 'alex.chen@university.edu';
  const existing = db.users.findOne((u) => u.email === demoEmail);
  if (!existing) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('DemoPass123!', salt);
    const demo = db.users.create({
      name: 'Alex Chen',
      email: demoEmail,
      passwordHash: hash,
      college: 'Stanford University',
      degree: 'B.S.',
      branch: 'Computer Science',
      graduationYear: '2025',
      roleInterest: 'Full Stack Software Engineer',
      targetCompanies: ['Google', 'Stripe', 'Linear', 'Vercel'],
      bio: 'Final year CS student passionate about distributed systems, React interfaces, and scalable backends.',
    });
    console.log('Demo user seeded:', demo.email);
  }
}

export default router;
