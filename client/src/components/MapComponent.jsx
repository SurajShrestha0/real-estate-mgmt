import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapComponent = ({ marker, onMarkerPlaced }) => {
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

    const initializeMap = ({ setMap, mapContainerRef }) => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [85.324, 27.7172], // Default center
        zoom: 13.5,
      });

      map.on("load", () => {
        setMap(map);
      });

      // Prevent default click behavior of the map container
      mapContainerRef.current.addEventListener("click", (e) => {
        e.preventDefault();
      });

      return () => {
        map.remove();
      };
    };

    if (!map) initializeMap({ setMap, mapContainerRef });
  }, [map]);

  useEffect(() => {
    if (map && marker) {
      const { latitude, longitude } = marker;
      if (markerRef.current) {
        markerRef.current.setLngLat([longitude, latitude]);
      } else {
        const newMarker = new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map);
        markerRef.current = newMarker;
      }

      map.flyTo({
        center: [longitude, latitude],
        essential: true,
      });

    }
  }, [map, marker]);

  const handleMapClick = (event) => {
    if (!map) return; // Ensure map is initialized

    if (markerRef.current) {
      markerRef.current.remove(); // Remove the previous marker
    }

    const newMarker = new mapboxgl.Marker()
      .setLngLat(event.lngLat)
      .addTo(map);

    markerRef.current = newMarker;
    const { lat, lng } = event.lngLat;
    setCoordinates({ latitude: lat, longitude: lng });
    onMarkerPlaced(lat, lng);
  };

  useEffect(() => {
    if (map) {
      map.on("click", handleMapClick); // Attach click event listener
    }
  }, [map]);

  return (
    <div>
      <div className="w-full h-60" ref={mapContainerRef} />
      {coordinates && (
        <div>
          Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
        </div>
      )}
    </div>
  );
};

export default MapComponent;
