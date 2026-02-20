const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userStorage, profileStorage } = require('../storage');

const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    // Check if user already exists
    const existingUser = await userStorage.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await userStorage.create({
      email,
      password: hashedPassword,
      email_verified: false
    });

    await userStorage.save(user);

    // Create profile with editable fields
    const profile = await profileStorage.create({
      user_id: user._id.toString(),
      email: user.email,
      first_name: first_name || null,
      last_name: last_name || null,
      phone: null,
      date_of_birth: null,
      avatar_url: null
    });

    await profileStorage.save(profile);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id.toString(),
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await userStorage.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if profile is complete
    const profile = await profileStorage.findOne({ user_id: user._id.toString() });
    const isProfileComplete = profile && profile.first_name && profile.last_name && profile.phone;

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        email: user.email
      },
      profile_complete: isProfileComplete
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login };
