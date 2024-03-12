import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Ensure Mapbox GL CSS is imported

mapboxgl.accessToken = 'pk.eyJ1IjoiZHJlYW1jYXRjaGVyMiIsImEiOiJjbHRud2FzMjkwYWFrMmxueXdnc3hneW83In0.0UOeq9rcLdP7pZbv6r-07w';

const MapComponent = () => {
 const mapContainerRef = useRef(null);
 const [mapObject, setMapObject] = useState(null);
 const [marker, setMarker] = useState(null);

 useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-104.9876, 39.7405], // Default center
      zoom: 12.5,
      projection: { name: "mercator" }, // Set projection to mercator to fix zooming issues
    });

    setMapObject(map);

    // Request user's location
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      // Update map center to user's location
      map.setCenter([longitude, latitude]);
    });

    // Add marker on click
    map.on('click', function(event) {
      if (marker) {
        marker.setLngLat(event.lngLat); // Update marker position
      } else {
        const newMarker = new mapboxgl.Marker()
          .setLngLat(event.lngLat)
          .addTo(map);
        setMarker(newMarker); // Keep track of the marker
      }

      // Log latitude and longitude
      console.log('Latitude:', event.lngLat.lat, 'Longitude:', event.lngLat.lng);
    });

    return () => map.remove();
 }, []);

 return <div className="w-full h-60" ref={mapContainerRef} />;
};

export default MapComponent;
