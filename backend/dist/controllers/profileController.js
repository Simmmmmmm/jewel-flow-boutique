"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const index_1 = require("../index");
const Profile_1 = require("../entities/Profile");
const profileRepository = index_1.AppDataSource.getRepository(Profile_1.Profile);
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profile = await profileRepository.findOne({ where: { user_id: userId } });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { first_name, last_name, phone, date_of_birth, avatar_url } = req.body;
        let profile = await profileRepository.findOne({ where: { user_id: userId } });
        if (!profile) {
            // Create profile if it doesn't exist
            profile = profileRepository.create({
                user_id: userId,
                email: req.user.email,
                first_name,
                last_name,
                phone,
                date_of_birth,
                avatar_url
            });
        }
        else {
            // Update existing profile
            profile.first_name = first_name || profile.first_name;
            profile.last_name = last_name || profile.last_name;
            profile.phone = phone || profile.phone;
            profile.date_of_birth = date_of_birth || profile.date_of_birth;
            profile.avatar_url = avatar_url || profile.avatar_url;
        }
        await profileRepository.save(profile);
        res.json({
            message: 'Profile updated successfully',
            profile
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateProfile = updateProfile;
