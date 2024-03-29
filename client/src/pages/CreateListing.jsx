import React, { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent.jsx";
import { toast } from "react-hot-toast";

export default function CreateListing() {
  const { currentUser, access_token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  console.log(currentUser);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    latitude: null,
    longitude: null,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log(formData);
  useEffect(() => {
    console.log(formData);
   }, [formData]);
   

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 10) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });

          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image Upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 9 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },

        (error) => {
          reject(error);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleMarkerPlaced = (lat, lng) => {
    console.log("Latitude:", lat, "Longitude:", lng);
    setLatitude(lat);
    setLongitude(lng);
  
    setFormData((prevState) => ({
      ...prevState,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than the regular price");
      if (!latitude || !longitude)
        return setError("Please place a marker on the map to set the location.");
  
      setLoading(true);
      setError(false);
  
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
  
      navigate(`/listing/${data._id}`);
      toast.success("Listing created successfully");
    } catch (error) {
      setError(error.message);
      setLoading(false);
      toast.error("Failed to create listing");
    }
  };
  

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <div className="flex flex-col gap-4 flex-1 max-w-md py-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-2 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-2 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-2">
            <div className="flex gap-4">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-4">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-4">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-4">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-4">
            <input
              type="checkbox"
              id="offer"
              className="w-5"
              onChange={handleChange}
              checked={formData.offer}
            />
            <span>Offer</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="bedrooms"
              min="1"
              max="10"
              required
              className="p-2 border border-gray-300 rounded-lg"
              onChange={handleChange}
              value={formData.bedrooms}
            />
            <p>Beds</p>
            <input
              type="number"
              id="bathrooms"
              min="1"
              max="10"
              required
              className="p-2 border border-gray-300 rounded-lg"
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <p>Baths</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="regularPrice"
              min="0"
              max="10000000000"
              required
              className="p-2 border border-gray-300 rounded-lg"
              onChange={handleChange}
              value={formData.regularPrice}
            />
            <div className="flex flex-col items-center">
              <p>Regular price</p>
              <span className="text-xs">(Rs. / month)</span>
            </div>
          </div>
          {formData.offer && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="0"
                max="10000000000"
                required
                className="p-2 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">(Rs. / month)</span>
              </div>
            </div>
          )}
          
        </div>

        <div className="flex flex-col gap-4 max-w-md">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 9)
            </span>
          </p>
          <div className="flex gap-4 items-center">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-2 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-2 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-xs">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border item-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          <div>
            <p className="font-semibold">Mark the location of property: </p>
            <br />
            <MapComponent onMarkerPlaced={handleMarkerPlaced} />
          </div>

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
