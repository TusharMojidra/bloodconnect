import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', default: null },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    donationDate: { type: Date, required: true },
    units: { type: Number, required: true, min: 1, default: 1 },
    hospital: { type: String, default: '' },
    city: { type: String, default: '' },
  },
  { timestamps: true }
);

donationSchema.index({ userId: 1 });
donationSchema.index({ donorId: 1 });

export default mongoose.model('Donation', donationSchema);
