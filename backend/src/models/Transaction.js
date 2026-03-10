import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  type: {
    type: String,
    enum: ['issuance', 'transfer', 'retirement', 'cancellation'],
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  credits: {
    type: Number,
    required: true,
    min: [1, 'Credits must be at least 1']
  },
  pricePerCredit: {
    type: Number,
    min: 0
  },
  totalAmount: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  reason: {
    type: String,
    required: function() {
      return this.type === 'retirement' || this.type === 'cancellation';
    }
  },
  retirementDetails: {
    beneficiary: String,
    purpose: String,
    retirementDate: Date
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationDate: Date,
    verificationNotes: String
  },
  metadata: {
    serialNumbers: [String],
    vintage: String,
    standard: String,
    methodology: String
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate transaction ID
transactionSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Transaction').countDocuments();
    this.transactionId = `TXN-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  
  // Calculate total amount
  if (this.pricePerCredit && this.credits) {
    this.totalAmount = this.pricePerCredit * this.credits;
  }
  
  next();
});

// Indexes
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ project: 1 });
transactionSchema.index({ from: 1 });
transactionSchema.index({ to: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
