import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Donor from './models/Donor.js';
import BloodRequest from './models/BloodRequest.js';
import Donation from './models/Donation.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('Seeding initial demo data...');

    await Promise.all([
      User.deleteMany({}),
      Donor.deleteMany({}),
      BloodRequest.deleteMany({}),
      Donation.deleteMany({}),
    ]);

    const salt = await bcrypt.genSalt(10);

    const adminUser = await User.create({
      fullName: 'System Admin',
      email: 'admin@bloodconnect.org',
      passwordHash: await bcrypt.hash('admin12345', salt),
      phone: '9876543210',
      city: 'Delhi',
      role: 'admin',
    });

    const demoUser = await User.create({
      fullName: 'Demo User',
      email: 'demo@bloodconnect.org',
      passwordHash: await bcrypt.hash('demo12345', salt),
      phone: '9876500001',
      city: 'Mumbai',
      role: 'user',
    });

    const sampleUsers = [];
    const sampleNames = [
      'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikram Singh',
      'Anjali Verma', 'Rohan Mehta', 'Kavya Reddy', 'Arjun Nair', 'Pooja Joshi',
    ];
    const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Jaipur'];
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const genders = ['male', 'female'];

    for (let i = 0; i < sampleNames.length; i++) {
      const u = await User.create({
        fullName: sampleNames[i],
        email: `user${i + 1}@example.com`,
        passwordHash: await bcrypt.hash('password123', salt),
        phone: `98765${String(i + 1).padStart(5, '0')}`,
        city: cities[i % cities.length],
        role: 'user',
      });
      sampleUsers.push(u);
    }

    const donors = [];
    for (let i = 0; i < sampleUsers.length; i++) {
      const d = await Donor.create({
        userId: sampleUsers[i]._id,
        fullName: sampleUsers[i].fullName,
        age: 22 + (i % 20),
        gender: genders[i % 2],
        bloodGroup: bloodGroups[i % bloodGroups.length],
        phone: sampleUsers[i].phone,
        email: sampleUsers[i].email,
        city: sampleUsers[i].city,
        lastDonationDate: i % 3 === 0 ? new Date(2025, i % 12, 15) : null,
        available: i % 4 !== 0,
      });
      donors.push(d);
    }

    await Donor.create({
      userId: demoUser._id,
      fullName: demoUser.fullName,
      age: 28,
      gender: 'female',
      bloodGroup: 'O+',
      phone: demoUser.phone,
      email: demoUser.email,
      city: demoUser.city,
      available: true,
    });

    const requests = [
      { patientName: 'Rajesh Khanna', bloodGroup: 'O+', hospital: 'AIIMS', city: 'Delhi', unitsRequired: 2, urgency: 'critical', contactName: 'Sunita Khanna', contactPhone: '9876511111', status: 'pending', userId: demoUser._id },
      { patientName: 'Meera Iyer', bloodGroup: 'B+', hospital: 'Fortis Hospital', city: 'Mumbai', unitsRequired: 1, urgency: 'urgent', contactName: 'Karthik Iyer', contactPhone: '9876522222', status: 'pending', userId: sampleUsers[1]._id },
      { patientName: 'Ashok Reddy', bloodGroup: 'A-', hospital: 'Apollo Hospitals', city: 'Chennai', unitsRequired: 3, urgency: 'critical', contactName: 'Lakshmi Reddy', contactPhone: '9876533333', status: 'fulfilled', userId: sampleUsers[2]._id },
      { patientName: 'Deepak Yadav', bloodGroup: 'AB+', hospital: 'Max Healthcare', city: 'Delhi', unitsRequired: 1, urgency: 'normal', contactName: 'Sunita Yadav', contactPhone: '9876544444', status: 'pending', userId: sampleUsers[0]._id },
      { patientName: 'Sarla Jain', bloodGroup: 'O-', hospital: 'Narayana Health', city: 'Bangalore', unitsRequired: 2, urgency: 'urgent', contactName: 'Mahesh Jain', contactPhone: '9876555555', status: 'cancelled', userId: sampleUsers[4]._id },
      { patientName: 'Imran Khan', bloodGroup: 'B-', hospital: 'Ruby Hall Clinic', city: 'Pune', unitsRequired: 1, urgency: 'normal', contactName: 'Fatima Khan', contactPhone: '9876566666', status: 'pending', userId: sampleUsers[5]._id },
      { patientName: 'Geeta Rao', bloodGroup: 'A+', hospital: 'KIMS Hospital', city: 'Hyderabad', unitsRequired: 4, urgency: 'critical', contactName: 'Venkat Rao', contactPhone: '9876577777', status: 'fulfilled', userId: sampleUsers[3]._id },
    ];

    for (const r of requests) {
      await BloodRequest.create(r);
    }

    await Donation.create({
      userId: demoUser._id,
      donorId: null,
      bloodGroup: 'O+',
      donationDate: new Date(2025, 5, 20),
      units: 1,
      hospital: 'Lilavati Hospital',
      city: 'Mumbai',
    });

    await Donation.create({
      userId: sampleUsers[0]._id,
      donorId: donors[0]._id,
      bloodGroup: bloodGroups[0],
      donationDate: new Date(2025, 2, 10),
      units: 1,
      hospital: 'AIIMS',
      city: 'Delhi',
    });

    console.log('Seed data created successfully!');
    console.log('Test accounts:');
    console.log('  Admin: admin@bloodconnect.org / admin12345');
    console.log('  User:  demo@bloodconnect.org / demo12345');
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};
