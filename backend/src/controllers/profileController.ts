import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { profileStorage } from '../storage';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;

    const profile = await profileStorage.findOne({ user_id: userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { first_name, last_name, phone, avatar_url } = req.body;

    let profile = await profileStorage.findOne({ user_id: userId });

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await profileStorage.create({
        user_id: userId,
        email: req.user.email,
        first_name,
        last_name,
        phone,
        avatar_url
      });
    } else {
      // Update existing profile
      profile.first_name = first_name || profile.first_name;
      profile.last_name = last_name || profile.last_name;
      profile.phone = phone || profile.phone;
      profile.avatar_url = avatar_url || profile.avatar_url;
    }

    await profileStorage.save(profile);

    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
