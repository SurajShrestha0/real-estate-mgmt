import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

const MapComponent = ({ initialLocation, onLocationChange }) => {
  const [position, setPosition] = useState(initialLocation || null); // Initialize with null
  const markerRef = useRef(null); // Reference to the marker

  useEffect(() => {
    if (!initialLocation) {
      console.log("Getting current position...");
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log("Position:", pos);
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        onLocationChange({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    } else {
      console.log("Setting initial location:", initialLocation);
      setPosition(initialLocation);
    }
  }, [initialLocation, onLocationChange]);

  const handleMarkerDragEnd = (event) => {
  console.log("Marker drag end event triggered");
  const marker = markerRef.current;
  if (marker) {
    const newLocation = marker.getLatLng();
    console.log("New marker location:", newLocation);
    
    // Update state with the new location coordinates
    setPosition(newLocation);
    
    // Call parent function to update listing location
    onLocationChange({ lat: newLocation.lat, lng: newLocation.lng });
  }
};


  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && (
        <Marker
          position={position}
          draggable
          eventHandlers={{ dragend: handleMarkerDragEnd }}
          ref={markerRef}
        >
          <Popup>Property Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;

