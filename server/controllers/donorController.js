import Donor from '../models/Donor.js';

export const getDonors = async (req, res) => {
  try {
    const { bloodGroup, city, available } = req.query;
    const filter = {};

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = city;
    if (available === 'true') filter.available = true;

    const donors = await Donor.find(filter).sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch donors: ${error.message}` });
  }
};

export const getDonorByUserId = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found.' });
    }
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch donor: ${error.message}` });
  }
};

export const createDonor = async (req, res) => {
  try {
    const { fullName, age, gender, bloodGroup, phone, email, city, lastDonationDate, available } = req.body;

    if (!fullName || !age || !gender || !bloodGroup || !phone || !email || !city) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      return res.status(400).json({ message: 'Age must be between 18 and 65.' });
    }

    const existing = await Donor.findOne({ userId: req.user.id });
    if (existing) {
      return res.status(409).json({ message: 'You are already registered as a donor. Use update instead.' });
    }

    const donor = await Donor.create({
      userId: req.user.id,
      fullName: fullName.trim(),
      age: ageNum,
      gender,
      bloodGroup,
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      city,
      lastDonationDate: lastDonationDate || null,
      available: available !== undefined ? available : true,
    });

    res.status(201).json(donor);
  } catch (error) {
    res.status(500).json({ message: `Failed to create donor: ${error.message}` });
  }
};

export const updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found.' });
    }

    const isOwner = donor.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to update this donor.' });
    }

    const { fullName, age, gender, bloodGroup, phone, email, city, lastDonationDate, available } = req.body;
    const updates = {};
    if (fullName !== undefined) updates.fullName = fullName.trim();
    if (age !== undefined) {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
        return res.status(400).json({ message: 'Age must be between 18 and 65.' });
      }
      updates.age = ageNum;
    }
    if (gender !== undefined) updates.gender = gender;
    if (bloodGroup !== undefined) updates.bloodGroup = bloodGroup;
    if (phone !== undefined) updates.phone = phone.trim();
    if (email !== undefined) updates.email = email.toLowerCase().trim();
    if (city !== undefined) updates.city = city;
    if (lastDonationDate !== undefined) updates.lastDonationDate = lastDonationDate || null;
    if (available !== undefined) updates.available = available;

    const updated = await Donor.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: `Failed to update donor: ${error.message}` });
  }
};

export const toggleDonorAvailability = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found.' });
    }

    const isOwner = donor.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to update this donor.' });
    }

    donor.available = !donor.available;
    await donor.save();
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: `Failed to toggle availability: ${error.message}` });
  }
};

export const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found.' });
    }

    const isOwner = donor.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to delete this donor.' });
    }

    await Donor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Donor deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: `Failed to delete donor: ${error.message}` });
  }
};
