'use dom';

import { useEffect, useRef } from 'react';

export default function MapaWeb({
  dom,
}: {
  dom?: import('expo/dom').DOMProps;
}) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

    script.onload = () => {
      const L = (window as any).L;

      if (!L || !mapRef.current) return;

      const map = L.map(mapRef.current).setView(
        [-8.0476, -34.8770],
        13
      );

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }
      ).addTo(map);

      L.marker([-8.0476, -34.8770])
        .addTo(map)
        .bindPopup('Recife')
        .openPopup();
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
      link.remove();
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}