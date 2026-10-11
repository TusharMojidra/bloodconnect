import Donation from '../models/Donation.js';

export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user.id }).sort({ donationDate: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch donations: ${error.message}` });
  }
};

export const createDonation = async (req, res) => {
  try {
    const { bloodGroup, donationDate, units, hospital, city, donorId } = req.body;

    if (!bloodGroup || !donationDate) {
      return res.status(400).json({ message: 'Blood group and donation date are required.' });
    }

    const donation = await Donation.create({
      userId: req.user.id,
      donorId: donorId || null,
      bloodGroup,
      donationDate,
      units: units || 1,
      hospital: hospital || '',
      city: city || '',
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: `Failed to create donation: ${error.message}` });
  }
};
