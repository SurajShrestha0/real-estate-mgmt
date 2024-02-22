import React from "react";

export default function CreateListing() {
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-semibold text-center my-7">Create Listing</h1>
      <form className="flex flex-col space-y-4 sm:flex-row sm:space-x-4">
        <div className="flex flex-col space-y-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="input-field"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            placeholder="Description"
            className="input-field"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="input-field"
            id="address"
            required
          />
          <div className="flex flex-wrap gap-2">
            <CheckboxWithLabel id="sale" label="Sell" />
            <CheckboxWithLabel id="rent" label="Rent" />
            <CheckboxWithLabel id="parking" label="Parking spot" />
            <CheckboxWithLabel id="furnished" label="Furnished" />
            <CheckboxWithLabel id="offer" label="Offer" />
          </div>
          <div className="flex flex-wrap gap-2">
            <NumericInputWithLabel id="bedrooms" label="Beds" min="1" max="10" />
            <NumericInputWithLabel id="bathrooms" label="Baths" min="1" max="10" />
            <NumericInputWithLabel
              id="regularPrice"
              label="Regular price"
              min="50"
              max="1000000"
            />
            <NumericInputWithLabel
              id="discountPrice"
              label="Discounted price"
              min="0"
              max="1000000"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="input-field w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="btn-green">Upload</button>
          </div>
        </div>
      </form>
    </main>
  );
}

// Reusable Checkbox component with label
const CheckboxWithLabel = ({ id, label }) => {
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" id={id} className="w-5" />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

// Reusable Numeric Input component with label
const NumericInputWithLabel = ({ id, label, min, max }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        id={id}
        min={min}
        max={max}
        className="input-field"
        required
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};






// import React from "react";

// export default function CreateListing() {
//   return (
//     <main className="p-3 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-semibold text-center my-7">
//         Create Listing
//       </h1>
//       <form className="flex flex-col sm:flex-row gap-4">
//         <div className="flex flex-col gap-4 flex-1">
//           <input
//             type="text"
//             placeholder="Name"
//             className="border p-3 rounded-lg"
//             id="name"
//             maxLength="62"
//             minLength="10"
//             required
//           />
//           <textarea
//             type="text"
//             placeholder="Description"
//             className="border p-3 rounded-lg"
//             id="description"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Address"
//             className="border p-3 rounded-lg"
//             id="address"
//             required
//           />

//           <div className="flex gap-6 flex-wrap">
//             <div className="flex gap-2">
//               <input type="checkbox" id="sale" className="w-5" />
//               <span>Sell</span>
//             </div>

//             <div className="flex gap-2">
//               <input type="checkbox" id="rent" className="w-5" />
//               <span>Rent</span>
//             </div>

//             <div className="flex gap-2">
//               <input type="checkbox" id="parking" className="w-5" />
//               <span>Parking spot</span>
//             </div>

//             <div className="flex gap-2">
//               <input type="checkbox" id="furnished" className="w-5" />
//               <span>Furnished</span>
//             </div>

//             <div className="flex gap-2">
//               <input type="checkbox" id="offer" className="w-5" />
//               <span>Offer</span>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-6 ">
//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="bedrooms"
//                 min="1"
//                 max="10"
//                 required
//                 className="p-3 border boder-gray-300 rounded-lg"
//               />
//               <p>Beds</p>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="number"
//                   id="bathrooms"
//                   min="1"
//                   max="10"
//                   required
//                   className="p-3 border boder-gray-300 rounded-lg"
//                 />
//                 <p>Baths</p>
//               </div>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="number"
//                   id="regularPrice"
//                   min="50"
//                   max="1000000"
//                   required
//                   className="p-3 border boder-gray-300 rounded-lg"
//                 />
//                 <div className="flex items-center gap-2">
//                   <p>Regular price</p>
//                   <span className="text-xs">(Rs. / month)</span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="number"
//                   id="discountPrice"
//                   min="0"
//                   max="1000000"
//                   required
//                   className="p-3 border boder-gray-300 rounded-lg"
//                 />
//                 <div className="flex flex-col items-center">
//                   <p>Discounted price</p>
//                   <span className="text-xs">(Rs. / month)</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col flex-1 gap-4">
//           <p className="font-semibold">
//             Images:
//             <span className="font-normal text-gray-600 ml-2">
//               The first image will be the cover (max 6)
//             </span>
//           </p>
//           <div className="flex gap-4">
//             <input
//               className="p-3 border border-gray-300 rounded w-full"
//               type="file"
//               id="images"
//               accept="image/*"
//               multiple
//             />
//             <button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
//               Upload
//             </button>
//           </div>
//         </div>
//       </form>
//     </main>
//   );
// }
