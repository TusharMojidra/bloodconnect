import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18, max: 65 },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    city: { type: String, required: true, trim: true },
    lastDonationDate: { type: Date, default: null },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

donorSchema.index({ bloodGroup: 1 });
donorSchema.index({ city: 1 });
donorSchema.index({ userId: 1 });

export default mongoose.model('Donor', donorSchema);
