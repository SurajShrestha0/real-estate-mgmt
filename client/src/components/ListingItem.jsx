import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-1/4">
      <Link to={`/listing/${listing._id}`}>
        <div className="h-[320px] sm:h-[220px] overflow-hidden">
          <img
            src={
              listing.imageUrls[0] ||
              "https://assets-global.website-files.com/620ec747459e13c7cf12a39e/625b10a58137b364b18df2ea_iStock-94179607.jpg"
            }
            alt="Listing cover"
            className="w-full h-full object-cover hover:scale-105 transition-scale duration-300"
          />
        </div>
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate">{listing.address}</p>
          </div>
          <div className="">
            <p className="text-sm text-gray-600 line-clamp-2">
              {listing.description}
            </p>

            <p className=" text-slate-500 mt-2 font-semibold">
              Rs.{" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-IN")
                : listing.regularPrice.toLocaleString("en-IN")}
              {listing.type === "rent" && " / month"}
            </p>
            <div className="text-slate-700 flex gap-4">
              <div className="font-bold text-xs">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms}
                beds`
                  : `${listing.bedrooms} bed`}
              </div>
              <div className="font-bold text-xs">
                {listing.bedrooms > 1
                  ? `${listing.bathrooms}
                baths`
                  : `${listing.bathrooms} bath`}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
