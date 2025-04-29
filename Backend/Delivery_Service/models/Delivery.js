const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Restaurant', // Optional: if you have a Restaurant model
    },
    driverId: {
      type: String,
      ref: 'Driver', // Optional: if you have a Driver model
    },
    status: {
      type: String,
      enum: ['assigned', 'picked-up', 'completed', 'cancelled','in-progress'],
      default: 'assigned',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    orderDetails: {
      UserID: {
        type: String,
        required: false,
      },
      RestaurantID: {
        type: String,
        required: false,
      },
      RestaurantName: {
        type: String,
        required: false,
      },
      UserName: {
        type: String,
        required: false,
      },
      ItemData: [
        {
          ItemID: {
            type: String,
            required: false,
          },
          ItemName: {
            type: String,
            required: false,
          },
          Image: {
            type: String,
          },
          Quantity: {
            type: Number,
            required: false,
          },
          ItemPrice: {
            type: Number,
            required: false,
          },
        },
      ],
      TotalPrice: {
        type: Number,
        required: false,
      },
      PaymetStatus: {
        type: String,
        default: 'Processing',
      },
    },
  },
  { timestamps: true }
);

// Optional: For geospatial queries like finding nearby deliveries
deliverySchema.index({ location: '2dsphere' });

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
