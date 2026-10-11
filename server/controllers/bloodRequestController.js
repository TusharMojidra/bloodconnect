import BloodRequest from '../models/BloodRequest.js';

export const getBloodRequests = async (req, res) => {
  try {
    const { status, bloodGroup, city } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = city;

    const requests = await BloodRequest.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch blood requests: ${error.message}` });
  }
};

export const createBloodRequest = async (req, res) => {
  try {
    const { patientName, bloodGroup, hospital, city, unitsRequired, urgency, contactName, contactPhone } = req.body;

    if (!patientName || !bloodGroup || !hospital || !city || !contactName || !contactPhone) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    const units = parseInt(unitsRequired, 10);
    if (isNaN(units) || units <= 0) {
      return res.status(400).json({ message: 'Units required must be a positive number.' });
    }

    const request = await BloodRequest.create({
      userId: req.user.id,
      patientName: patientName.trim(),
      bloodGroup,
      hospital: hospital.trim(),
      city,
      unitsRequired: units,
      urgency: urgency || 'normal',
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      status: 'pending',
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: `Failed to create blood request: ${error.message}` });
  }
};

export const updateBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found.' });
    }

    const isOwner = request.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to update this request.' });
    }

    const { status, patientName, bloodGroup, hospital, city, unitsRequired, urgency, contactName, contactPhone } = req.body;
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (patientName !== undefined) updates.patientName = patientName.trim();
    if (bloodGroup !== undefined) updates.bloodGroup = bloodGroup;
    if (hospital !== undefined) updates.hospital = hospital.trim();
    if (city !== undefined) updates.city = city;
    if (unitsRequired !== undefined) {
      const units = parseInt(unitsRequired, 10);
      if (isNaN(units) || units <= 0) {
        return res.status(400).json({ message: 'Units required must be a positive number.' });
      }
      updates.unitsRequired = units;
    }
    if (urgency !== undefined) updates.urgency = urgency;
    if (contactName !== undefined) updates.contactName = contactName.trim();
    if (contactPhone !== undefined) updates.contactPhone = contactPhone.trim();

    const updated = await BloodRequest.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: `Failed to update blood request: ${error.message}` });
  }
};

export const deleteBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found.' });
    }

    const isOwner = request.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to delete this request.' });
    }

    await BloodRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blood request deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: `Failed to delete blood request: ${error.message}` });
  }
};

export const getMyBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch your blood requests: ${error.message}` });
  }
};
