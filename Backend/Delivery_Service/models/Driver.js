const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Driver schema definition
const driverSchema = new mongoose.Schema(
  {
    driverID: {
      type: String,
      required: true,
      unique: true,  // Ensure driverID is unique
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please fill a valid phone number'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        type: [Number],  // [longitude, latitude]
        required: true,
      },
    },
    assignedDeliveries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery',
      },
    ],
  },
  {
    timestamps: true,  // Created and updated timestamps
  }
);

// Middleware to hash password before saving it
driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
driverSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
