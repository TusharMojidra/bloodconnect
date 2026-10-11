import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, phone, city } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      phone: phone?.trim() || '',
      city: city || '',
      role: 'user',
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Signup failed: ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Login failed: ${error.message}` });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      city: user.city,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch user: ${error.message}` });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, city } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(fullName !== undefined && { fullName: fullName.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(city !== undefined && { city }),
      },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      city: user.city,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: `Profile update failed: ${error.message}` });
  }
};
