import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    
     const { latitude, longitude } = req.body;

     
    // Perform validation if necessary
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: "Invalid coordinates" });
    }
     
    //  const location = {
    //    type: 'Point',
    //    coordinates: [longitude, latitude],
    //  };
     
    //  req.body.location = location;
     
     const listing = await Listing.create({
      latitude,
      longitude,
      ...req.body,
     });

     console.log("smthg: ", req.body);
     return res.status(201).json(listing);
  } catch (error) {
     next(error);
  }
 };
 

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
     return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
     return next(errorHandler(401, "You can only update your own listings!"));
  }
 
  try {
     
     const { latitude, longitude } = req.body;
    
     if (latitude && longitude) {
       req.body.location = {
         type: 'Point',
         coordinates: [longitude, latitude],
       };
     }
     
     const updatedListing = await Listing.findByIdAndUpdate(
       req.params.id,
       req.body,
       { new: true }
     );
     res.status(200).json(updatedListing);
  } catch (error) {
     next(error);
  }
 };
 

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "false") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

      const totalListings = await  Listing.countDocuments();

    return res.status(200).json({listings, totalListings});
  } catch (error) {
    next(error);
  }
};
