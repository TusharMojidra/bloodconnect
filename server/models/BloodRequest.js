import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true, trim: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    hospital: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    unitsRequired: { type: Number, required: true, min: 1 },
    urgency: {
      type: String,
      required: true,
      enum: ['critical', 'urgent', 'normal'],
      default: 'normal',
    },
    contactName: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

bloodRequestSchema.index({ status: 1 });
bloodRequestSchema.index({ userId: 1 });

export default mongoose.model('BloodRequest', bloodRequestSchema);
