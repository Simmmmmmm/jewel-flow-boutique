
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AddressModel } from '../models/Address';

export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;

    const addresses = await AddressModel.find({ user_id: userId }).sort({ is_default: -1, created_at: -1 });

    res.json(addresses);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const addressData = req.body;

    // Check if address already exists for this user
    const existingAddress = await AddressModel.findOne({
      user_id: userId,
      first_name: addressData.first_name,
      last_name: addressData.last_name,
      address_line_1: addressData.address_line_1,
      city: addressData.city,
      state: addressData.state,
      postal_code: addressData.postal_code,
      phone: addressData.phone
    });

    if (existingAddress) {
      return res.status(409).json({
        message: 'Address already exists',
        address: existingAddress
      });
    }

    const address = new AddressModel({
      user_id: userId,
      ...addressData
    });

    await address.save();

    res.status(201).json({
      message: 'Address added successfully',
      address
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
