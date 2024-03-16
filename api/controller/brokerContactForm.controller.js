import TenantFormData from "../models/brokerContactForm.model.js";

export const saveTenantFormData = async (req, res) => {
  // Extract form data from the request body
  const { name, phoneNumber, message, brokerId, listingName } = req.body;

  // Create a new TenantFormData document using the Mongoose model
  const formData = new TenantFormData({
    name,
    phoneNumber,
    message,
    brokerId,
    listingName
  });

  try {
    // Save the form data to the database
    await formData.save();

    // Send a success response back to the client
    res.status(200).json({ message: 'Form data saved successfully' });
  } catch (error) {
    // Handle any errors that occur during saving
    console.error('Error saving form data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTenantFormData = async (req, res) => {
  try {
     const { brokerId } = req.params;
     // Query the database for form data associated with the brokerId
     const formData = await TenantFormData.find({ brokerId });
     res.status(200).json(formData);
  } catch (error) {
     res.status(500).json({ message: 'Error fetching form data', error });
  }
 };