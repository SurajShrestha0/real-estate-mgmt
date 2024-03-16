// Import necessary packages
import mongoose from "mongoose";

// Define the schema for the form data
const TenantFormDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  brokerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  listingName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model based on the schema
const TenantFormData = mongoose.model('TenantFormData', TenantFormDataSchema);

// Export the model
export default TenantFormData;
