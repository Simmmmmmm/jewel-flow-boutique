"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const User_1 = require("../entities/User");
const Profile_1 = require("../entities/Profile");
const userRepository = index_1.AppDataSource.getRepository(User_1.User);
const profileRepository = index_1.AppDataSource.getRepository(Profile_1.Profile);
const register = async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        // Check if user already exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        // Create user
        const user = userRepository.create({
            email,
            password: hashedPassword,
            email_verified: false
        });
        await userRepository.save(user);
        // Create profile
        const profile = profileRepository.create({
            user_id: user.id,
            email: user.email,
            first_name,
            last_name
        });
        await profileRepository.save(profile);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Check password
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
