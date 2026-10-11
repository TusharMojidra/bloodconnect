import User from '../models/User.js';
import Donor from '../models/Donor.js';
import BloodRequest from '../models/BloodRequest.js';

export const getStats = async (req, res) => {
  try {
    const [userCount, donorCount, requestCount, availableDonors] = await Promise.all([
      User.countDocuments(),
      Donor.countDocuments(),
      BloodRequest.countDocuments(),
      Donor.countDocuments({ available: true }),
    ]);

    const pendingRequests = await BloodRequest.countDocuments({ status: 'pending' });
    const fulfilledRequests = await BloodRequest.countDocuments({ status: 'fulfilled' });
    const cancelledRequests = await BloodRequest.countDocuments({ status: 'cancelled' });

    res.json({
      users: userCount,
      donors: donorCount,
      requests: requestCount,
      availableDonors,
      pendingRequests,
      fulfilledRequests,
      cancelledRequests,
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch stats: ${error.message}` });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch users: ${error.message}` });
  }
};

export const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch donors: ${error.message}` });
  }
};

export const getAllBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch blood requests: ${error.message}` });
  }
};
