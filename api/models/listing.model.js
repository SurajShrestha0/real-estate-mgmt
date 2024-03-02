import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
 {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    regularPrice: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      required: true,
    },

    bathrooms: {
      type: Number,
      required: true,
    },

    bedrooms: {
      type: Number,
      required: true,
    },

    furnished: {
      type: Boolean,
      required: true,
    },

    parking: {
      type: Boolean,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    offer: {
      type: Boolean,
      required: true,
    },

    imageUrls: {
      type: Array,
      required: true,
    },

    userRef: {
      type: String,
      required: true,
    },

    // Add location fields
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
 },
 { timestamps: true }
);

// This will add a 2dsphere index to your location field
listingSchema.index({ location: '2dsphere' });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
