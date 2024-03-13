import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapComponent = ({ latitude, longitude, onMarkerPlaced }) => {
  const mapContainerRef = useRef(null);
  const [mapObject, setMapObject] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [85.3240, 27.7172], // Set center based on props
      zoom: 13.5,
    });

    setMapObject(map);

    // Add marker at the specified latitude and longitude
    const newMarker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map);
    setMarker(newMarker);

    map.on("click", function (event) {
      if (marker) {
        marker.setLngLat(event.lngLat);
      } else {
        const newMarker = new mapboxgl.Marker()
          .setLngLat(event.lngLat)
          .addTo(map);
        setMarker(newMarker); // Keep track of the marker
        onMarkerPlaced(event.lngLat.lat, event.lngLat.lng);
      }
    });

    return () => map.remove();
  }, [latitude, longitude, onMarkerPlaced]);

  return (
    <div>
      <div className="w-full h-60" ref={mapContainerRef} />
    </div>
  );
};

export default MapComponent;
