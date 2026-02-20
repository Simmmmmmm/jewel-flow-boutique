"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAddress = exports.getAddresses = void 0;
const index_1 = require("../index");
const Address_1 = require("../entities/Address");
const addressRepository = index_1.AppDataSource.getRepository(Address_1.Address);
const getAddresses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const addresses = await addressRepository.find({ where: { user_id: userId }, order: { is_default: 'DESC' } });
        res.json(addresses);
    }
    catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAddresses = getAddresses;
const addAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const addressData = req.body;
        const address = addressRepository.create({
            user_id: userId,
            ...addressData
        });
        await addressRepository.save(address);
        res.status(201).json({
            message: 'Address added successfully',
            address
        });
    }
    catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.addAddress = addAddress;
